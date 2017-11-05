angular.module('LoginController', ['ngCookies']).controller('LoginController', function($scope, $window, $cookies, UserService) {
    $scope.myFunction = function(user, password) {
        // have a check for user field and password, nonempty
        
        UserService.authenticateUser(user, password).then(function(res) {
            $cookies.put('token', res.data.token);
            $window.location.href = '/calendar';
        }, function(err) {
            // show a message on the screen saying that there is an error.
            console.log(err);
        });
    }
});