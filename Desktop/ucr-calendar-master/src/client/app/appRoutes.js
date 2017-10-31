angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'HomeController'
        })
        .when('/login', {
            templateUrl: 'app/views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'app/views/register.html',
            controller: 'RegisterController'
        })
        .when('/calendar', {
            templateUrl: 'app/views/calendar.html',
            controller: 'CalendarController'
         })
         .when('/feed', {
            templateUrl: 'app/views/feed.html',
            controller: 'FeedController'
         });

    $locationProvider.html5Mode(true);  
}]);