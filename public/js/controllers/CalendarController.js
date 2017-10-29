angular.module('CalendarController', ['ngCookies']).controller('CalendarController', function($scope, $cookies, $window, UserService, CalendarEventService) {
    $scope.tag = "Calendar!";
    
    let token = $cookies.get('token');
    console.log(token); // this is the current logged in user
    if (token === undefined) {
        $window.location.href = "/";
    }

    UserService.getUser(token).then(function(response) {
        // valid user. populate the calendar UI.
    }, function(err) {
        $window.location.href = "/";
    });
});

/* 
 * Example of using API to create an event
 */
// CalendarEventService.createEvent("eventName", "eventTime", "eventDescription", true, token).then(function(success) {
//     console.log("Event created!");
// }, function(error) {
//     console.log("Event failed to be created!");
// });    