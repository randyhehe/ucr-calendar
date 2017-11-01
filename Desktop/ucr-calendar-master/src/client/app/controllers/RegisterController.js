angular.module('RegisterController', []).controller('RegisterController', function($scope, $window, UserService) {
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
            document.getElementById('email_message').style.color = 'red';
            document.getElementById('email_message').innerHTML = 'Please enter your email.';
            numErrors++;
        }
        if (firstPassword === undefined || firstPassword === '') {
            // first password is empty, output error onto screen
            //console.log("first password is empty");
            document.getElementById('first_message').style.color = 'red';
            document.getElementById('first_message').innerHTML = 'Password cannot be empty!';
            numErrors++;
        }
        if (secondPassword === undefined || secondPassword === '') {
            // second password is empty, output error onto screen
            //console.log("second password is empty");
            document.getElementById('second_message').style.color = 'red';
            document.getElementById('second_message').innerHTML = 'Please verify your password.';
            numErrors++;
        }
        if (firstPassword !== secondPassword) {
            // passwords don't match, output error onto screen
            //console.log("passwords don't match");
            document.getElementById('second_message').style.color = 'red';
            document.getElementById('second_message').innerHTML = 'Passwords do not match!';
            numErrors++;
        }

        if (numErrors === 0) {
            var node = document.getElementById('email_message');
            while (node.hasChildNodes()) {
                node.removeChild(node.firstChild);
            }
            var node = document.getElementById('first_message');
            while (node.hasChildNodes()) {
                node.removeChild(node.firstChild);
            }
            var node = document.getElementById('second_message');
            while (node.hasChildNodes()) {
                node.removeChild(node.firstChild);
            }
            createUser(email, username, firstPassword);
        }
    }

    function createUser(email, username, password, callback) {
        email = email.toLowerCase();

        UserService.userExists(email).then(function(res) {
            UserService.createUser(email, username, password).then(function(res) {
                var node = document.getElementById('email_message');
                while (node.hasChildNodes()) {
                  node.removeChild(node.firstChild);
                }
                $window.location.href = '/';
            }, function(err) {
                document.getElementById('email_message').style.color = 'red';
                document.getElementById('email_message').innerHTML = 'Email already in use.';
                //console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    }
});
