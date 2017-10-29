angular.module('SecondPageController', []).controller('SecondPageController', function($scope, $window, UserService) {
    $scope.register = function(username, email, firstPassword, secondPassword) {
        let numErrors = 0;
        if (username === undefined || username === '') {
            // userrname is empty, output error onto screen
            console.log("username is empty");
            numErrors++;
        } 
        if (email === undefined || email === '') {
            // email is empty, output error onto screen
            console.log('email is empty');
            numErrors++;
        } 
        if (firstPassword === undefined || firstPassword === '') {
            // first password is empty, output error onto screen
            console.log("first password is empty");
            numErrors++;
        }
        if (secondPassword === undefined || secondPassword === '') {
            // second password is empty, output error onto screen
            console.log("second password is empty");
            numErrors++;
        }
        if (firstPassword !== secondPassword) {
            // passwords don't match, output error onto screen
            console.log("passwords don't match");
            numErrors++;
        } 
        
        if (numErrors === 0) {
            createUser(email, username, firstPassword);
        }
    }

    function createUser(email, username, password, callback) {
        email = email.toLowerCase();

        UserService.userExists(email).then(function(res) {
            UserService.createUser(email, username, password).then(function(res) {
                $window.location.href = '/';
            }, function(err) {
                console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    }
});