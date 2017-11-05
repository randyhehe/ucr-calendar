angular.module('UserService', []).factory('UserService', ['$http', function($http) {
    return {
        userExists: function(user) {
            return $http.get('/api/users/exists/' + user).then(function(res) {
                return res.data.exists;
            });
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

        authenticateUser: function(user, password) {
            let data = {
                user: user,
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
            return $http.get('/api/users/me', {headers: {"x-access-token": token}});
        }
        
    }
}]);