angular.module('HomeController', []).controller('HomeController', function($scope, $window) {
    $scope.redirectSignup = function() {
        $window.location.href = "/register";
    };
    $scope.redirectLogin = function() {
        $window.location.href = "/login";
    };
});