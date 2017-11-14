angular.module('LoginController', ['ngCookies']).controller('LoginController', function($scope, $window, $cookies, UserService) {
    let token = $cookies.get('token');
    UserService.getUser(token)
    .then(redirectUser)
    .catch((err) => {
        // keep user on page
    });
    
    $scope.login = function(user, password) {        
        UserService.authenticateUser(user, password).then(function(res) {
            $cookies.put('token', res.data.token);
            $window.location.href = '/calendar';
        }, function(err) {
            $scope.invalid = true;
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

    function redirectUser(user) {
        $window.location.href = "/calendar";
    }
});