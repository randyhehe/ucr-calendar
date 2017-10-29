angular.module('CalendarEventService', []).factory('CalendarEventService', ['$http', function($http) {
    return {
        createEvent: function(name, time, description, public, token) {
            let data = {
                name: name,
                time: time,
                description: description,
                public: public
            };
            data = JSON.stringify(data);

            return $http({
                method: 'POST',
                url: '/api/events',
                data: data,
                timeout: 4000,
                headers: {
                    "x-access-token": token
                }
            });
        },
        
        getEvents: function(token) {
            return $http.get('/api/events/me', {headers: {"x-access-token": token}});
        }
    }
}]);