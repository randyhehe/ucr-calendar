angular.module('FeedController', ['ngCookies']).controller('FeedController', function($scope, $cookies, $window, UserService, HeaderService, FriendService) {
    $scope.feedPage = true;
    $scope.signOut = HeaderService.signOut;    

    let token = $cookies.get('token');
    console.log(token); // this is the current logged in user
    if (token === undefined) {
        $window.location.href = "/";
    }

    UserService.getUser(token).then(function(res) {
        FriendService.getEvents(token).then(function(events) {
            console.log(events);

            $scope.friendEvents = [];
            for (let i = events.length - 1; i >= 0; i--) {
                let calEvent = events[i];
                let formattedEvent  = {
                    user: calEvent.user,
                    name: calEvent.name,
                    description: calEvent.description,
                    createdTime: moment(calEvent.createdAt).fromNow(),
                    startTime: moment(calEvent.startTime, 'x').format('MM/DD/YYYY h:mma'),
                    endTime: moment(calEvent.endTime, 'x').format('MM/DD/YYYY h:mma')
                }
                $scope.friendEvents.push(formattedEvent);
            }
        }).catch(function(error) {
            // do someething with thee error
        });

        // FriendService.getFriends(token).then(function(friends) {
        //     $scope.friends = [];
        //     for (let i = 0; i < friends.length; i++) {
        //         $scope.friends.push(friends[i].username);
        //     }
        // });

    }, function(err) {
        $window.location.href = "/";
    });
});