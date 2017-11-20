angular.module('AppController', ['ngCookies', 'btford.socket-io']).controller('AppController', AppController);

function AppController($scope, $window, $location, $cookies, $route, $mdToast, UserService, FriendService, socket, CalendarEventService) {
    //let vent = new CustomEvent("installed");
    if(navigator.serviceWorker.controller) {
        console.log('fishy');
        let vent = new CustomEvent('installed');
        navigator.serviceWorker.controller.dispatchEvent(vent);
    }
    init();
    var serviceWorkerRegistration;
    if('serviceWorker' in navigator)
    {
        navigator.serviceWorker.register('service-worker.js').then(function() {
            return navigator.serviceWorker.ready;
        })
        .then(function(reg) {
            //reg.dispatchEvent(vent);
            reg.active.postMessage(JSON.stringify({token: $scope.token, events: events}));
        })
        .catch(function(err) {
            console.log('Service worker errored');
        });
    }

    $scope.goToCalendar = function() {
        $location.path('/calendar');
        $scope.showCalendarPage = true;
        $scope.showFeedPage = false;
    }

    $scope.goToFeed = function() {
        $location.path('/feed');
        $scope.showCalendarPage = false;
        $scope.showFeedPage = true;
    }

    $scope.acceptFriendRequest = function(friendName) {
        FriendService.addFriend(friendName, $scope.token)
        .then(() => {
            UserService.getUser($scope.token).then(initNotifications).catch(redirectUser);
            $mdToast.show($mdToast.simple().textContent('Friend added.').position('bottom left'));
            if ($scope.showFeedPage) {
                $scope.$broadcast('acceptFriendRequest');
            }
        }).catch((err) => {
            if (err.data.message) {
                $mdToast.show($mdToast.simple().textContent(err.data.message).position('bottom left'));
            }
        });
    }

    $scope.deleteIncomingFriendRequest = function(friendName) {
        FriendService.deleteIncomingFriendRequest(friendName, $scope.token)
        .then(() => {
            UserService.getUser($scope.token).then(initNotifications).catch(redirectUser);
            $mdToast.show($mdToast.simple().textContent('Friend request removed.').position('bottom left'));
        }).catch((err) => {
            if (err.data.message) {
                $mdToast.show($mdToast.simple().textContent(err.data.message).position('bottom left'));
            }
        })
    }

    function init() {
        $scope.token = $cookies.get('token');

        UserService.getUser($scope.token)
        .then(initNotifications)
        .then(initEvents)
        .then(initSettings)
        .then(initSocket)
        .then(routeHandler) // handle route if authentication is successful
        .catch(redirectUser); // redirect user out of the app if authentication fail

        $scope.signOut = redirectUser;
        $scope.$on('addFriendRequest', (ev, friendName, username) => {
            socket.emit('addFriendRequest', friendName, username);
        });
        $(document).on('click', '.dropdown .notif-dropdown-menu', (e) => {e.stopPropagation()});
    }

    function routeHandler() {
        $scope.show = true;
        $scope.showCalendarPage = ($location.path() === '/calendar');
        $scope.showFeedPage = ($location.path() === '/feed');

        // keep controller from refreshing in route change
        let lastRoute = $route.current;
        $scope.$on('$locationChangeSuccess', (event) => {
            $route.current = lastRoute;
        });
    }
    function initEvents(user) {
        let events = [];
        CalendarEventService.getEvents($scope.token).then(function(res) {
            for(let i = 0; i < res.data.events.length; i++) {
                /*let startTime = moment(res.data.events[i].startTime, 'x');
                let notifTime = moment(startTime, 'x').subtract(30, 'minute');
                let currTime = new Date();
                currTime = moment(currTime).format('x')
                if(notifTime > currTime) {
                    events.push(res.data.events[i]);

                    let date = new Date(moment(notifTime,'x').format('YYYY'),
                    moment(notifTime, 'x').format('MM'),
                    moment(notifTime, 'x').format('DD'),
                    moment(notifTime, 'x').format('hh'),
                    moment(notifTime, 'x').format('mm'),
                    moment(notifTime, 'x').format('ss'),
                    );
                    let j = schedule.scheduleJob(date, function() {
                        console.log('happy kids');
                    });
                }*/
                if(res.data.events[i].notify) {
                    events.push(res.data.events[i]);
                }
                let currTime = new Date();
                let currYear = moment(currTime, 'x').format('YYYY');
                let currMonth = moment(currTime, 'x').format('MM');
                let currDay = moment(currTime, 'x').format('DD');
                let currHour = moment(currTime, 'x').format('HH');
                let currMin = moment(currTime, 'x').format('mm');
                for(let i = 0; i < events.length; i++)
                {
                    let notifTime = moment(events[i].startTime, 'x').subtract(30, 'minute');
                    if(moment(notifTime, 'x').format('YYYY') == currYear
                    && moment(notifTime, 'x').format('MM') == currMonth
                    && moment(notifTime, 'x').format('DD') == currDay
                    && moment(notifTime, 'x').format('HH') == currHour
                    && moment(notifTime, 'x').format('mm') == currMin) {
                        //notify
                    }
                }
            }
        });
        return user;
    }

    function initNotifications(user) {
        $scope.notifications = [];
        FriendService.getFriendRequests($scope.token).then((friendRequests) => {
            let incomingRequests = [];
            for (let i = 0; i < friendRequests.length; i++) {
                if (friendRequests[i].receiver === user.username) {
                    incomingRequests.push(friendRequests[i].sender);
                }
            }
            $scope.notifications = incomingRequests;
        });
        return user;
    }

    function initSettings(user) {
        $scope.username = user.username;
        return user;
    }

    function initSocket(user) {
        socket.emit('subscribe', user.username);

        socket.on('addFriendRequest', function(friendName) {
            $scope.notifications.push(friendName);
        });

        $scope.$on('$destroy', () => {
            socket.removeAllListeners();
        });
        return user;
    }

    function redirectUser(err) {
        // when 'sign out' button is clicked or unsuccessful auth
        if (err === undefined || (err !== undefined && !err.data.success && err.status === 403)) {
            $cookies.remove('token');
            $window.location.href = '/';
        } else {
            // if another unhandled error... redirect or do nothing?
            console.log('Why');
        }
    }
}
