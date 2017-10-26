angular.module('SecondPageController', []).controller('SecondPageController', function($scope, UserService) {
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
        UserService.getUser(email).then(function(response) {
            // user exists, can't create the account. show this message on the page.
            console.log("user exists!");
        }, function(error) {
            // cannot find a user with specified username, create account
            UserService.createUser(email, username, password, function(res) {
                console.log(res);
            });
        });
    }
});