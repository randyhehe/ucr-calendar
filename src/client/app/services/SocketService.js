angular.module('SocketService', []).factory('SocketService', function() {
    return {
        initSocket: function(socket, username, $scope) {
            socket.emit('subscribe', username);
            $scope.$on('$destroy', function(event) {
                socket.removeAllListeners();
            });
        }
    }
});