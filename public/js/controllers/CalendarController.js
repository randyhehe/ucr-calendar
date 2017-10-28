angular.module('CalendarController', ['ngCookies']).controller('CalendarController', function($scope, $cookies, $window, UserService) {
    $scope.tag = "Calendar!";
    console.log($cookies.get('token')); // this is the current logged in user
    
    let token = $cookies.get('token');
    if (token === undefined) {
        $window.location.href = "/";
    }

    UserService.getUser($cookies.get('token')).then(function(response) {
        if (!response.data.success) {
            $window.location.href = "/";
        } else {
            // correctly logged in, populate the UI
        }

        console.log(response);
    }, function(err) {
        $window.location.href = "/";
    });
});