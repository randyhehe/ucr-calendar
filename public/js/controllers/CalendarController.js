angular.module('CalendarController', ['ngCookies']).controller('CalendarController', function($scope, $cookies) {
    $scope.tag = "Calendar!";
    console.log($cookies.get('email')); // this is the current logged in user
});