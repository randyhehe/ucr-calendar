angular.module('FriendService', []).factory('FriendService', ['$http', function($http) {
    return {
        addFriend: function(username, token) {
            let data = {
                username: username
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

        getFriends: function(token) {
            return $http.get('/api/friends/me', {headers: {"x-access-token": token}}).then(function(res) {
                return res.data.friends;
            });
        },

        getEvents: function(token) {
            return $http.get('/api/friends/events', {headers: {"x-access-token": token}}).then(function(res) {
                return res.data.events;
            });
        }
    }
}]);