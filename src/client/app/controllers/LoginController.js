angular.module('LoginController', ['ngCookies']).controller('LoginController', function($scope, $window, $cookies, UserService) {
    $scope.login = function(user, password) {
        // have a check for user field and password, nonempty
        
        UserService.authenticateUser(user, password).then(function(res) {
            $cookies.put('token', res.data.token);
            $window.location.href = '/calendar';
        }, function(err) {
            $scope.invalid = true;
            // document.getElementById('password_message').style.color = 'black';
            // document.getElementById('password_message').innerHTML = 'Incorrect username or password.';
            console.log(err);
        });
    }

    $scope.redirectHome = function() {
        $window.location.href = '/';        
    }

    $scope.showPassword = function() {
        let x = document.getElementById("myInput");
        if (x.type === 'password') {
            x.type = 'text';
        } else {
            x.type = 'password';
        }
    }
});