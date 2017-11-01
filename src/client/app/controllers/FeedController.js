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
    }, function(err) {
        $window.location.href = "/";
    });
});

/*
 * Example of using API to get friend events in order of creation time
 */
// FriendService.getEvents(token).then(function(res) {
//     console.log(res);
// }, function(err) {
//     // handle error here
// });
