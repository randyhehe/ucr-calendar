angular.module('UserService', []).factory('UserService', ['$http', function($http) {
    return {
        userExists: function(email) {
            return $http.get('/api/users/exists/' + email);
        },

        createUser: function(email, username, password) {
            let data = {
                email: email,
                username: username,
                password: password
            };
            data = JSON.stringify(data);
            
            return $http({
                method: 'POST',
                url: '/api/users',
                data: data,
                timeout: 4000
            });
        },

        authenticateUser: function(email, password) {
            let data = {
                email: email,
                password: password
            };
            data = JSON.stringify(data);

            return $http({
                method: 'POST',
                url: '/api/users/auth',
                data: data,
                timeout: 4000
            });
        },

        getUser: function(token) {
            return $http.get('/api/users/me', { headers: { "x-access-token": token } });
        }
        
    }
}]);