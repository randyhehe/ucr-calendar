angular.module('AppController', ['ngCookies', 'btford.socket-io']).controller('AppController', AppController);

function AppController($scope, $window, $location, $cookies, $route, $mdToast, UserService, FriendService, socket) {
    init();    

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
            console.log(err);
            // handle error
        });
    }

    $scope.deleteFriendRequest = function(friendName) {
        FriendService.deleteFriendRequest(friendName, $scope.token)
        .then(() => {
            UserService.getUser($scope.token).then(initNotifications).catch(redirectUser);   
            $mdToast.show($mdToast.simple().textContent('Friend request removed.').position('bottom left'));
        }).catch((err) => {
            console.log(err);
            // handle error
        })
    }

    function init() {
        $scope.token = $cookies.get('token');
        UserService.getUser($scope.token)
        .then(initNotifications)
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