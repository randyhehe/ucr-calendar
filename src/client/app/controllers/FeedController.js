angular.module('FeedController', []).controller('FeedController', FeedController);

function FeedController($scope, UserService, FriendService, $mdToast) {
    init();

    $scope.addFriendRequest = function() {
        const friendName = $scope.addFriendInput;
        FriendService.addFriendRequest(friendName, $scope.token).then(() => { 
            $mdToast.show($mdToast.simple().textContent('Requested to add ' + friendName + '.').position('top right'));
            return UserService.getUser($scope.token);
        }).then((user) => {
            $scope.$emit('addFriendRequest', friendName, user.username);
        }).catch((err) => {
            $mdToast.show($mdToast.simple().textContent(err.data.message).position('top right'));
        });
    }

    $scope.removeFriend = function(friendName) {
        FriendService.deleteFriend(friendName, $scope.token).then((res) => {
            $mdToast.show($mdToast.simple().textContent("Removed " + friendName + " as friend.").position('top right'));
            return UserService.getUser($scope.token);
        }).then(() => {
            // can optimize this later if necessary
            FriendService.getEvents($scope.token).then(populateEvents).catch(errHandler);
            FriendService.getFriends($scope.token).then((friends) => $scope.friends = friends).catch(errHandler);            
        })
        .catch((err) => {
            $mdToast.show($mdToast.simple().textContent(err.data.message).position('top right'));
        });
    }

    function init() {
        UserService.getUser($scope.token).then(initFeed).catch(errHandler);
    }

    function initFeed(user) {
        FriendService.getEvents($scope.token).then(populateEvents).catch(errHandler);
        FriendService.getFriends($scope.token).then((friends) => $scope.friends = friends).catch(errHandler);

        $scope.$on('acceptFriendRequest', () => {
            FriendService.getEvents($scope.token).then(populateEvents).catch(errHandler);
            FriendService.getFriends($scope.token).then((friends) => $scope.friends = friends).catch(errHandler);
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