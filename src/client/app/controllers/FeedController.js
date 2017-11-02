angular.module('FeedController', ['ngCookies']).controller('FeedController', function($scope, $cookies, $window, UserService, HeaderService, FriendService) {
    $scope.feedPage = true;
    $scope.signOut = HeaderService.signOut;    

    let token = $cookies.get('token');
    console.log(token); // this is the current logged in user
    if (token === undefined) {
        $window.location.href = "/";
    }

    UserService.getUser(token).then(function(res) {
        // valid user. populate the feeds UI.
        console.log(res);

        FriendService.getEvents(token).then(function(res) {

            $scope.todos = [];            
            for (let i = res.data.events.length - 1; i >= 0; i--) {
                let calEvent = res.data.events[i];
                let formattedEvent  = {
                    user: calEvent.user,
                    name: calEvent.name,
                    description: calEvent.description,
                    createdTime: moment(calEvent.createdAt).fromNow(),
                    startTime: moment(calEvent.startTime, 'x').format('MM/DD/YYYY h:mma'),
                    endTime: moment(calEvent.endTime, 'x').format('MM/DD/YYYY h:mma')
                }
                $scope.todos.push(formattedEvent);
            }
        }, function(err) {
            console.log(err);
        });
    }, function(err) {
        $window.location.href = "/";
    });
});