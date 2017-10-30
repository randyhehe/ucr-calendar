angular.module('FeedController', ['ngCookies']).controller('FeedController', function($scope, $cookies, $window, UserService, HeaderService) {
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