angular.module('FeedController', []).controller('FeedController', FeedController);

function FeedController($scope, UserService, FriendService, $mdToast) {
    init();

    $scope.addFriendRequest = function() {
        const friendName = $scope.addFriendInput;
        $scope.addFriendInput = '';
        FriendService.addFriendRequest(friendName, $scope.token).then(() => {
            $mdToast.show($mdToast.simple().textContent('Requested to add ' + friendName + '.').position('bottom left'));
            FriendService.getFriends($scope.token).then(populateFriends).then(populateFriendRequests).catch(errHandler);            
            return UserService.getUser($scope.token);
        }).then((user) => {
            $scope.$emit('addFriendRequest', friendName, user.username);
        }).catch((err) => {
            $mdToast.show($mdToast.simple().textContent(err.data.message).position('bottom left'));
        });
    }

    $scope.removeFriend = function(friendName) {
        FriendService.deleteFriend(friendName, $scope.token).then((res) => {
            $mdToast.show($mdToast.simple().textContent("Removed " + friendName + " as friend.").position('bottom left'));
            return UserService.getUser($scope.token);
        }).then(() => {
            // can optimize this later if necessary
            FriendService.getEvents($scope.token).then(populateEvents).catch(errHandler);
            FriendService.getFriends($scope.token).then(populateFriends).then(populateFriendRequests).catch(errHandler);
        })
        .catch((err) => {
            $mdToast.show($mdToast.simple().textContent(err.data.message).position('bottom left'));
        });
    }

    $scope.deleteOutgoingFriendRequest = function(friendName) {
        FriendService.deleteOutgoingFriendRequest(friendName, $scope.token)
        .then((res) => {
            console.log('res');
            console.log(res);
            FriendService.getFriends($scope.token).then(populateFriends).then(populateFriendRequests).catch(errHandler);
        }).catch((err) => {
            if (err.data.message) {
                $mdToast.show($mdToast.simple().textContent(err.data.message).position('bottom left'));                            
            }
        });
    }

    function init() {
        UserService.getUser($scope.token).then(initFeed).catch(errHandler);
    }

    function initFeed(user) {
        FriendService.getEvents($scope.token).then(populateEvents).catch(errHandler);
        FriendService.getFriends($scope.token).then(populateFriends).then(populateFriendRequests).catch(errHandler);

        $scope.$on('acceptFriendRequest', () => {
            FriendService.getEvents($scope.token).then(populateEvents).catch(errHandler);
            FriendService.getFriends($scope.token).then(populateFriends).then(populateFriendRequests).catch(errHandler);
        });
    }

    function populateFriends(friends) {
        $scope.friends = friends;
        return FriendService.getFriendRequests($scope.token).then((friendRequests) => {
            return friendRequests;
        });
    }

    function populateFriendRequests(friendRequests) {
        $scope.outgoingRequests = {};
        UserService.getUser($scope.token).then((user) => {
            for (let i = 0; i < friendRequests.length; i++) {
                if (friendRequests[i].sender === user.username) {
                    $scope.friends.push(friendRequests[i].receiver);
                    $scope.outgoingRequests[friendRequests[i].receiver] = true;
                }
            }
            // console.log($scope.friends);
            // console.log($scope.outgoingRequests);
        });
    }


    function populateEvents(events) {
        $scope.friendEvents = [];        
        for (let i = events.length - 1; i >= 0; i--) {
            const calEvent = events[i];
            const formattedEvent  = {
                user: calEvent.user,
                name: calEvent.name,
                description: calEvent.description,
                createdTime: moment(calEvent.createdAt).fromNow(),
                startTime: moment(calEvent.startTime, 'x').format('MM/DD/YYYY h:mma'),
                endTime: moment(calEvent.endTime, 'x').format('MM/DD/YYYY h:mma')
            }
            $scope.friendEvents.push(formattedEvent);
        }

        // setup timer to update 'fromNow' property every minute on the ng-repeated list
        if ($scope.timerInterval !== undefined) clearInterval($scope.timerInterval); 
        $scope.timerInterval = setInterval(eventTimer, 60 * 1000);
        $scope.$on('$destroy', (event) => {
            clearInterval($scope.timerInterval);
        });

        function eventTimer() {
            for (let i = 0; i < events.length; i++) {
                const revIndex = events.length - 1 - i;
                $scope.friendEvents[i].createdTime = moment(events[revIndex].createdAt).fromNow();
            }
            $scope.$apply();
        }
    }

    // handle errors
    function errHandler(err) {
        console.log(err);
    }
}