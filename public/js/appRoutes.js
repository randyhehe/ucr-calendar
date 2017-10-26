angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/secondpage', {
            templateUrl: 'views/secondpage.html',
            controller: 'SecondPageController'
        })
        .when('/calendar', {
            templateUrl: 'views/calendar.html',
            controller: 'CalendarController'
         }) ;

    $locationProvider.html5Mode(true);  
}]);