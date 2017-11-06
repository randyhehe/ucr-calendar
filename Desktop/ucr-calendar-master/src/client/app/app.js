angular.module('CalendarApp', [
    'ngRoute', 
    'appRoutes', 
    'HomeController', 
    'LoginController', 
    'RegisterController', 
    'CalendarController', 
    'FeedController', 
    'UserService', 
    'CalendarEventService', 
    'FriendService', 
    'HeaderService',
    'SocketService',
    'btford.socket-io',
    'ngCookies'
]).factory('socket', function(socketFactory) {
    let socket = socketFactory();
    return socket;
});