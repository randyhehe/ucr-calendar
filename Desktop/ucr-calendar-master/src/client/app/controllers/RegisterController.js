angular.module('RegisterController', []).controller('RegisterController', function($scope, $window, UserService) {
    $scope.register = function(username, email, firstPassword, secondPassword) {
        let numErrors = 0;
        if (username === undefined || username === '') {
            // userrname is empty, output error onto screen
            console.log("username is empty");
            numErrors++;
        } 

        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(username)) {
            console.log('Username can only have characters from a-z, A-Z, and 0-9');
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
        
        UserService.userExists(username).then(function(exists) {
            if (exists) throw new Error("Username exists!");
            return UserService.userExists(email);
        }).then(function(exists) {
            if (exists) throw new Error("Email exists!");
            return UserService.createUser(email, username, password);
        }).then(function(res) {
            $window.location.href = '/';
        }).catch(function(err) {
            console.log(err.message);
        });
    }
});