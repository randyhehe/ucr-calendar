angular.module('LoginController', ['ngCookies']).controller('LoginController', function($scope, $window, $cookies, UserService) {
    $scope.myFunction = function(email, password) {
        // have a check for email and password, nonempty
        
        email = email.toLowerCase();
        UserService.authenticateUser(email, password).then(function(res) {
            $cookies.put('token', res.data.token);
            $window.location.href = '/calendar';
        }, function(err) {
            // show a message on the screen saying that there is an error.
            console.log(err);
        });
    }
});