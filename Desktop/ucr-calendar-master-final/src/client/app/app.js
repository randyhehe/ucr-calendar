angular.module('CalendarApp', [
    'ngRoute', 
    'appRoutes', 
    'HomeController', 
    'LoginController', 
    'RegisterController', 
    'CalendarController', 
    'FeedController', 
    'AppController',
    'UserService', 
    'CalendarEventService', 
    'FriendService', 
    'btford.socket-io',
]).factory('socket', function(socketFactory) {
    let socket = socketFactory();
    return socket;
});