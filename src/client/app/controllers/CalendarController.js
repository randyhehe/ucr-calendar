angular.module('CalendarController', ['ngCookies', 'angularMoment', 'ngMaterial', 'ngMessages', 'ui.timepicker'])
.config(($mdDateLocaleProvider) => {
    // Overwrites the default format with 'l' -> MM/DD/YYYY' flexible (month/day can have one digit)
    $mdDateLocaleProvider.parseDate = function(dateString) {
        let format = 'l';
        let m = moment(dateString, format, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    }
})
.controller('CalendarController', CalendarController);



function CalendarController($scope, $cookies, $window, UserService, CalendarEventService, FriendService, $mdDialog, $mdToast) {


    // function checkForEvent() {
    //     let token = $cookies.get('token');
    //     let x = []
    //     CalendarEventService.getEvents(token).then(function(res) {
    //         // x = res.data.events
    //         x.push('2');
    //         x.push('123123');
    //         console.log(x);

    //     })
    //     // x.push('1')
    //     // x.push('123')
    //     // console.log(x)
    //     return x;
    // }
    $scope.monthName = moment().startOf("month").format('MMMM'); // string output of current month
    $scope.yearDate = moment().format('YYYY');
    $scope.currentDate = moment(); // used to highlight current date
    var currMoment = moment();

    render(currMoment) // init render of current month

   function render(currMoment) {

     var lastMonth = currMoment.subtract(1,'months').endOf('month').format('DD');
     var nextMonth = currMoment.add(1,'months').endOf('month').format('DD');

     var firstDay = currMoment.startOf('month').day(); // Returns the first day of the month
     firstDay = parseInt(firstDay);
     var lastDay = currMoment.endOf('month').day(); // Returns the last day of the month
     lastDay = parseInt(lastDay);

     var numberOfDays = currMoment.daysInMonth(); // Returns number of days
     var i,tempFirstDay;
     var x = lastMonth;
     let token = $cookies.get('token');

       CalendarEventService.getEvents(token).then(function(res) {
        console.log(res.data.events);
        // // console.log(moment(parseInt(res.data.events[8].startTime)).format('D'));
        // console.log(parseInt(moment(parseInt(res.data.events[8].startTime)).format('D')));
        // // console.log(moment(parseInt(res.data.events[8].startTime)).format('Y'));
        // // console.log(moment(parseInt(res.data.events[8].startTime)).format('DD'));

        // console.log(currMoment.format('D'));
        // console.log(currMoment.format('M'));
        // console.log(currMoment.format('Y'));
        // // console.log(res.data.events.length)
        // // console.log(currMoment.subtract(1,'months').endOf('month').format('MM'));
        // let a = checkForEvent();
        // console.log(a)

        // console.log(currMoment.format('M'));
        // tempX = currMoment;
        // tempX.add(2,'months');

        // console.log(currMoment.format('M'))



       for (i = firstDay - 1; i >= 0; i--) { //prev month
        var rowPosition = 'col' + i;
        $scope[rowPosition] = x;
        $scope[rowPosition + 'IsPrevMonth'] = true;
        let prevMonth = parseInt(currMoment.format('M'));
        let prevYear = parseInt(currMoment.format('Y'));
        // console.log(prevMonth,prevYear)
        if ( prevMonth == 1 ) { //if curr month is january
            prevMonth = 12;
            prevYear--;
        }
        else {
            prevMonth--;
        }
         for (j = 0; j < res.data.events.length; ++j) {
            let eventDay = parseInt(moment(parseInt(res.data.events[j].startTime)).format('D'));
            let eventMonth = parseInt(moment(parseInt(res.data.events[j].startTime)).format('M'));
            let eventYear = parseInt(moment(parseInt(res.data.events[j].startTime)).format('Y'));
            // console.log(eventDay,eventMonth,eventYear);
            // console.log(x ,prevMonth,prevYear);
            if ( eventMonth == prevMonth && eventYear == prevYear &&
                  eventDay == x ){
                console.log(moment(parseInt(res.data.events[j].startTime)).format("MMM Do YY"));
            $scope[rowPosition] = res.data.events[j].description;
                }
         }
        x--;
       }
       tempFirstDay = firstDay;


       for (i = 1; i <= numberOfDays; i++) { //curr month
         rowPosition = "col" + tempFirstDay;
         tempFirstDay = tempFirstDay + 1;


         if (i == $scope.currentDate.format('D') && currMoment.format("M")
         == $scope.currentDate.format("M") &&
         currMoment.format("YY") == $scope.currentDate.format("YY")) {
           $scope[rowPosition] = i;
           $scope[rowPosition + 'IsActiveDay'] = true;

         }
         else {
            $scope[rowPosition] = i;
         }
        for (j = 0; j < res.data.events.length; ++j) {
            let eventDay = parseInt(moment(parseInt(res.data.events[j].startTime)).format('D'));
            let eventMonth = parseInt(moment(parseInt(res.data.events[j].startTime)).format('M'));
            let eventYear = parseInt(moment(parseInt(res.data.events[j].startTime)).format('Y'));

            if ( eventMonth == currMoment.format('M') && eventYear == currMoment.format('Y') &&
                  eventDay == i ){

                // console.log(res.data.events[j].description);
                console.log(moment(parseInt(res.data.events[j].startTime)).format("MMM Do YY"));
                $scope[rowPosition] = res.data.events[j].description;
                // console.log(res.data.events[j])
            }
         }
       }

       for (i = 1; i <= 42 - numberOfDays - firstDay; ++i) { //nxt month
         rowPosition = "col" + tempFirstDay;
         tempFirstDay = tempFirstDay + 1;
         $scope[rowPosition] = i;
         $scope[rowPosition + 'IsNextMonth'] = true;
        let nxtMonth = parseInt(currMoment.format('M'));
        let nxtYear = parseInt(currMoment.format('Y'));
        if ( nxtMonth == 12 ) { //if curr month is january
            nxtMonth = 1;
            nxtYear++;
        }
        else {
            nxtMonth++;
         }
         for (j = 0; j < res.data.events.length; ++j) {
            let eventDay = parseInt(moment(parseInt(res.data.events[j].startTime)).format('D'));
            let eventMonth = parseInt(moment(parseInt(res.data.events[j].startTime)).format('M'));
            let eventYear = parseInt(moment(parseInt(res.data.events[j].startTime)).format('Y'));
            if ( eventMonth == nxtMonth && eventYear == nxtYear &&
                  eventDay == i ){
                console.log(moment(parseInt(res.data.events[j].startTime)).format("MMM Do YY"));
                $scope[rowPosition] = res.data.events[j].description;
            }
         }
       }

       })
     }

     $scope.next = function(){ // next toggle button
       $scope.monthName = currMoment.add(1,'months').startOf("month").format('MMMM');
       if ($scope.monthName == "January") {
         $scope.yearDate = currMoment.add(0,'years').format('YYYY');
       }
       render(currMoment)
     }

     $scope.previous = function(){ // prev toggle button
       $scope.monthName = currMoment.subtract(1,'months').startOf("month").format('MMMM');
       if ($scope.monthName == "December") {
         $scope.yearDate = currMoment.subtract(0,'years').format('YYYY');
       }
       render(currMoment)
     }

     $scope.calendarPage = true;

    $scope.createEvent = function(ev) {
        $mdDialog.show({
          controller: CreateEventController,
          templateUrl: 'create-event-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          focusOnOpen: false,
          fullscreen: $scope.customFullscreen,
          token: $scope.token

        });
    };

    function CreateEventController($scope, $mdDialog, token) {
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

}
