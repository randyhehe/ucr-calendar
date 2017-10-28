angular.module('MainController', ['ngCookies']).controller('MainController', function($scope, $window, $cookies, UserService) {

    $scope.myFunction = function(email, password) {
        
        // have a check for email and password, nonempty

        email = email.toLowerCase();
        UserService.authenticateUser(email, password, function(err, res) {
            if (err) {
                // show a message on the screen saying that there is an error
                console.log("error: wrong credentials");
            } else if (!res.data.success) {
                
            } else { // no errors, proceed to login
                $cookies.put('token', res.data.token);
                $window.location.href = "/calendar";
            }
        });
    }
});