angular.module('MainController', ['UserService']).controller('MainController', function($scope, UserService) {
    UserService.get().then(function(response) {
        $scope.tagline = response.data;
    });
});