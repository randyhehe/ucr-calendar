angular.module('HomeController', ['ngCookies']).controller('HomeController', HomeController);

function HomeController($scope, $window, $cookies, UserService) {
    let token = $cookies.get('token');
    UserService.getUser(token)
    .then(redirectUser)
    .catch((err) => {
        $scope.show = true;
        // keep user on page
    });

    $scope.redirectSignup = function() {
        $window.location.href = "/register";
    };

    $scope.redirectLogin = function() {
        $window.location.href = "/login";
    };

    function redirectUser(user) {
        $window.location.href = "/calendar";
    }
};