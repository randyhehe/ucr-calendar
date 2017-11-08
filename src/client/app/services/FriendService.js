angular.module('FriendService', []).factory('FriendService', ['$http', function($http) {
    return {
        addFriendRequest: function(username, token) {
            let data = {
                username: username
            };
            data = JSON.stringify(data);

            return $http({
                method: 'POST',
                url: '/api/friendRequests',
                data: data,
                timeout: 4000,
                headers: {
                    'x-access-token': token
                }
            });
        },

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

        deleteFriend: function(username, token) {
            let data = {
                username: username
            };
            data = JSON.stringify(data);

            console.log('blah');
            console.log(data);

            return $http({
                method: 'DELETE',
                url: '/api/friends',
                data: data,
                timeout: 4000,
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
        },

        getFriends: function(token) {
            return $http.get('/api/friends/me', {headers: {"x-access-token": token}}).then(function(res) {
                return res.data.friends;
            });
        },

        getFriendRequests: function(token) {
            return $http.get('/api/friendRequests/me',{headers: {"x-access-token": token}}).then(function(res) {
                console.log(res);
                return res.data.friendRequests;
            });
        },

        getEvents: function(token) {
            return $http.get('/api/friends/events', {headers: {"x-access-token": token}}).then(function(res) {
                return res.data.events;
            });
        }
    }
}]);