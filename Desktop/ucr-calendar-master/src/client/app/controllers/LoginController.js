angular.module('LoginController', ['ngCookies']).controller('LoginController', function($scope, $window, $cookies, UserService) {
    $scope.myFunction = function(user, password) {
        // have a check for user field and password, nonempty

        UserService.authenticateUser(user, password).then(function(res) {
            $cookies.put('token', res.data.token);
            $window.location.href = '/calendar';
        }, function(err) {
            // show a message on the screen saying that there is an error.
            document.getElementById('password_message').style.color = 'red';
            document.getElementById('password_message').innerHTML = 'Incorrect password.';
            console.log(err);
        });
    }

    $scope.passwordFunction = function() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
});
