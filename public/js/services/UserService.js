angular.module('UserService', []).factory('UserService', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('/api/users');
        }
    }
}]);