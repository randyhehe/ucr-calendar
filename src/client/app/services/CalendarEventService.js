angular.module('CalendarEventService', []).factory('CalendarEventService', ['$http', function($http) {
    return {
        createEvent: function(name, startTime, endTime, description, public, token) {
            let data = {
                name: name,
                startTime: startTime,
                endTime: endTime,
                desc: description,
                public: public
            };
            data = JSON.stringify(data);

            return $http({
                method: 'POST',
                url: '/api/events',
                data: data,
                timeout: 4000,
                headers: {
                    'x-access-token': token
                }
            });
        },

        updateEvent: function(id, name, startTime, endTime, description, public, token) {
            let data = {
                id: id,
                name: name,
                startTime: startTime,
                endTime: endTime,
                desc: description,
                public: public
            };
            data = JSON.stringify(data);

            return $http({
                method: 'POST',
                url: '/api/updateEvent',
                data: data,
                timeout: 4000,
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

        },

        deleteEvent: function(id, token) {
            let data = {
                id: id
            };
            data = JSON.stringify(data);

            return $http({
                method: 'DELETE',
                url: '/api/deleteEvent',
                data: data,
                timeout: 4000,
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
        },

        getEvents: function(token) {
            return $http.get('/api/events/me', {headers: {'x-access-token': token}});
        },

        removeNotif: function(eventId, token) {
            let data = {
                eventId: eventId
            };
            data = JSON.stringify(data);

            return $http({
                method: 'POST',
                url: '/api/events/removeNotif',
                data: data,
                timeout: 4000,
                headers: {
                    'x-access-token': token
                }
            });
        }
    }
}]);
