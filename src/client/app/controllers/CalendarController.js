angular.module('CalendarController', ['ngCookies', 'angularMoment', 'ngMaterial', 'ngMessages', 'ui.timepicker', 'btford.socket-io'])
.config(function($mdDateLocaleProvider) {
    // Overwrites the default format with 'l' -> MM/DD/YYYY' flexible (month/day can have one digit)
    $mdDateLocaleProvider.parseDate = function(dateString) {
        let format = 'l';
        let m = moment(dateString, format, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    }
})
.controller('CalendarController', function($scope, $cookies, $window, UserService, CalendarEventService, FriendService, HeaderService, SocketService, $mdDialog, $mdToast, socket) {
    $scope.calendarPage = true;
    $scope.signOut = HeaderService.signOut;    
    let token = $cookies.get('token');
    
    console.log(token); // this is the current logged in user
    if (token === undefined) {
        $window.location.href = "/";
    }

    $scope.username = '';
    UserService.getUser(token).then(function(user) {
        // valid user. actions here.
        $scope.username = user.username;
        console.log("username");
        console.log($scope.username);
        SocketService.initSocket(socket, user.username, $scope);
        socket.on('hi', function(data) {
            console.log(data);
        });
    }, function(err) {
        $window.location.href = "/";
    });

    $scope.createEvent = function(ev) {
        $mdDialog.show({
          controller: CreateEventController,
          templateUrl: 'create-event-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          focusOnOpen: false,
          fullscreen: $scope.customFullscreen
        });
    };

    function CreateEventController($scope, $mdDialog) {
        $scope.timePickerOptions = {
            scrollDefault: 'now',
            asMoment: true
        }

        $scope.eventName = "Untitled Event";

        let currDate = new Date();
        $scope.minDate = new Date(currDate.getFullYear() -  1000, currDate.getMonth(), currDate.getDate());
        $scope.maxDate = new Date(currDate.getFullYear() +  1000, currDate.getMonth(), currDate.getDate());

        $scope.startDate = $scope.startTime = roundNext15Min(moment());
        $scope.endDate = $scope.endTime = roundNext15Min(moment().add('30', 'm'));

        $scope.startTimeChange = function() {
            let newMoment = new moment($scope.startDate);
            newMoment.minute(moment($scope.startTime).minute());
            newMoment.hour(moment($scope.startTime).hour());
            $scope.startDate = $scope.startTime = newMoment;
        }

        $scope.endTimeChange = function() {
            let newMoment = new moment($scope.endDate);
            newMoment.minute(moment($scope.endTime).minute());
            newMoment.hour(moment($scope.endTime).hour());
            $scope.endDate = $scope.endTime = newMoment;
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.createEvent = function() {
            let $dates = angular.element(document.querySelectorAll('.dateform input'));
            let startDate = angular.element($dates[0]).val();
            let startTime = angular.element($dates[1]).val();
            let endDate = angular.element($dates[2]).val();
            let endTime = angular.element($dates[3]).val();
            let eventName = angular.element(document.querySelector('.eventnameform input')).val();
            let eventDescription =  angular.element(document.querySelector('.eventdescription textarea')).val();

            // check validity
            const format = 'l';    
            let error = false;            

            $scope.createEventError = '';
            if (!moment(startDate, format, true).isValid() || !moment(endDate, format, true).isValid()) {
                if (!error) $scope.createEventError = "Invalid calendar date.";
                error = true;
            } 
            // check empty name
            if (eventName === '') {
                if (!error) $scope.createEventError = "Empty event name.";                
                error = true;
            }
            
            // make sure the events are in the right other
            let startMoment = moment(startDate + ' ' + startTime, 'MM/DD/YYYY h:mma');
            let endMoment = moment(endDate + ' ' + endTime, 'MM/DD/YYYY h:mma');
            if (endMoment.isSameOrBefore(startMoment)) {
                if (!error) $scope.createEventError = "Event end date must be after start date.";
                error =  true;
            }
            let public = true;

            if (!error) {
                // should have a way to toggle private and public... do this later
                CalendarEventService.createEvent(eventName, startMoment.valueOf(), endMoment.valueOf(), eventDescription, public, token)
                 .then(function(res) {
                    console.log(res);
                    $mdToast.show($mdToast.simple().textContent('Event Successfully Created!').position('top right'));
                    $mdDialog.cancel();

                    return UserService.getUser(token);         
                }).then(function(user) {
                    let event = {
                        eventName: eventName,
                        user: user.username,
                        startTime: startMoment.valueOf(),
                        endTime: endMoment.valueOf(),
                        description: eventDescription,
                        public: public
                    }
                    console.log(event);
                    socket.emit('event', event);

                }).catch(function(err) {
                    console.log(err);
                });
            } else {
                // show the error message
            }
        }

        function roundNext15Min(moment) {
            var intervals = Math.floor(moment.minutes() / 15);
            if (moment.minutes() % 15 != 0) {
                intervals++;
                if (intervals == 4) {
                    moment.add(1, 'hours');
                    intervals = 0;
                }
                moment.minutes(intervals * 15);
                moment.seconds(0);
            }
            return moment;
        }
    }
});