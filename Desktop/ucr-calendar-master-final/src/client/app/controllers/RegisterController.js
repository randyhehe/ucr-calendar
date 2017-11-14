angular.module('RegisterController', []).controller('RegisterController', function($scope, $window, UserService) {
    $scope.register = function(username, email, firstPassword, secondPassword) {
        let numErrors = 0;

        // Check Username
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (username === undefined || username === '') {
            $scope.showUsernameError = true;
            $scope.usernameError = 'Username cannot be empty.';
            numErrors++;
        } else if (!usernameRegex.test(username)) {
            $scope.showUsernameError = true;
            $scope.usernameError = 'Username can only have characters from a-z, A-Z, and 0-9';
            numErrors++;
        } else {
            $scope.showUsernameError = false;
        }

        // Check Email
        if (email === undefined || email === '') {
            $scope.emailError = 'Email cannot be empty.';
            $scope.showEmailError = true;  
            numErrors++;
        } else {
            $scope.showEmailError = false;
        }

        // Check Password
        if (firstPassword === undefined || firstPassword === '') {
            $scope.showFirstPasswordError = true;
            numErrors++;
        } else {
            $scope.showFirstPasswordError = false;
        }
        if (secondPassword === undefined || secondPassword === '') {
            $scope.secondPasswordError = 'Please verify your password.';
            $scope.showSecondPasswordError = true;
            numErrors++;
        } else if (firstPassword !== secondPassword) {
            $scope.secondPasswordError = 'Passwords do not match.';
            $scope.showSecondPasswordError = true;
             numErrors++;
        } else {
            $scope.showSecondPasswordError = false;
        }

        if (numErrors === 0) {
            createUser(email, username, firstPassword);
        }
    }

    $scope.redirectHome = function() {
        $window.location.href = '/';        
    }

    function createUser(email, username, password, callback) {
        email = email.toLowerCase();

        UserService.userExists(username).then(function(exists) {
            if (exists){
                $scope.usernameError = 'Username is already in use.';
                $scope.showUsernameError = true;                
                throw new Error("Username exists!")
            }
            return UserService.userExists(email);
        }).then(function(exists) {
            if (exists){
                $scope.emailError = 'Email is already in use.';
                $scope.showEmailError = true;                
                throw new Error("Email exists!");
            }
            return UserService.createUser(email, username, password);
        }).then(function(res) {
            $window.location.href = '/';
        }).catch(function(err) {
            console.log(err.message);
        });
    }
});