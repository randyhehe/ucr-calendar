angular.module('FriendService', []).factory('FriendService', ['$http', function($http) {
    return {
        addFriend: function(email, token) {
            let data = {
                email: email
            };
            data = JSON.stringify(data);

            return $http({
                method: 'POST',
                url: '/api/friends',
                data: data,
                timeout: 4000,
                headers: {
                    'x-access-token': token
                }
            });
        },

        getEvents: function(token) {
            return $http.get('/api/friends/events', {headers: {"x-access-token": token}});
        }
    }
}]);