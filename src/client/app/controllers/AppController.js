angular.module('AppController', ['ngCookies', 'btford.socket-io']).controller('AppController', AppController);

function AppController($scope, $window, $location, $cookies, $route, $mdToast, UserService, FriendService, socket, CalendarEventService) {
    init();

    // window.webkitNotifications.createNotification('ico.gif', 'Title', 'Text')

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
        .then(initEventNotifications)
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

    function initEventNotifications(user) {
        setInterval(function() {
            CalendarEventService.getEvents($scope.token).then(function(res) {
                let events = res.data.events;
                for(let i = 0; i < events.length; i++) {
                    if(!events[i].notify) continue;

                    let startTime = moment(events[i].startTime, 'x');
                    let curr = moment();
                    let notif = moment().add(30, 'minutes');
                    if (!startTime.isBefore(curr) && notif.isAfter(startTime)) {
                        // display the notification
                        let title = events[i].name + " " + moment(startTime, 'x').fromNow();
                        webNotification.showNotification(title, {
                            body: events[i].description,
                            autoClose: false,
                            onClick: function() {
                                window.focus();
                                $scope.goToCalendar();
                                $scope.$apply();
                                $scope.$broadcast('showEvent', events[i]);
                            }
                        }),
                        CalendarEventService.removeNotif(events[i]._id, $scope.token);
                    }
                }
            });
        }, 10000);

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
        }
    }
}