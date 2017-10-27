angular.module('MainController', ['ngCookies']).controller('MainController', function($scope, $window, $cookies, UserService) {

    $scope.myFunction = function(email, password) {
        
        // have a check for email and password, nonempty

        email = email.toLowerCase();
        UserService.authenticateUser(email, password, function(err, res) {
            if (err) {
                // show a message on the screen saying that there is an error
                console.log("error");
            } else {
                $cookies.put('email', email);
                $window.location.href = "/calendar";
            }
        });
    }
});