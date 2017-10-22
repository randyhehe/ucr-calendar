angular.module('UserService', []).factory('UserService', ['$http', function($http) {
    return {
        getUser: function(email) {
            return $http.get('/api/users/' + email);
        },

        createUser: function(email, username, password, callback) {
            var data = {
                email: email,
                username: username,
                password: password
            };
            data = JSON.stringify(data);
            
            $http({
                method: 'POST',
                url: '/api/users',
                data: data,
                timeout: 4000
            }).then(function(success) {
                callback(success);
            }, function(error) {
                // deal with error
            });
        },

        authenticateUser: function(email, password, callback) {
            var data = {
                email: email,
                password: password
            };
            data = JSON.stringify(data);

            $http({
                method: 'POST',
                url: '/api/users/auth',
                data: data,
                timeout: 4000
            }).then(function(success) {
                callback(null, success);
            }, function(error) {
                callback(error, null);
            });
        }
    }
}]);