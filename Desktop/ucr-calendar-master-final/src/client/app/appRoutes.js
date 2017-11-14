angular.module('appRoutes', ['ui.router'])
// .config(function($stateProvider) {
//     let calendarState = {
//         name: 'calendar',
//         url: '/calendar',
//         templateUrl: 'app/views/app.html',
//         controller: 'AppController'
//     }

//     let feedState = {
//         name: 'feed',
//         url: '/feed',
//         templateUrl: 'app/views/app.html',
//         controller: 'AppController'
//     }

//     $stateProvider.state(calendarState);
//     $stateProvider.state(feedState);
// });


.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
            templateUrl: 'app/views/app.html',
            controller: 'AppController',
            reloadOnSearch: false
        })
        .when('/feed', {
            templateUrl: 'app/views/app.html',
            controller: 'AppController',
            reloadOnSearch: false
         });
        // //  .otherwise({
        // //      redirectTo: '/'
        // //  })

    $locationProvider.html5Mode(true);  
}]);