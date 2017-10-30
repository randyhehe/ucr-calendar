angular.module('HeaderService', ['ngCookies']).factory('HeaderService', function($cookies, $window) {
    return {
        signOut: function() {
            $cookies.remove('token');
            $window.location.href= "/";
        }
    }
});