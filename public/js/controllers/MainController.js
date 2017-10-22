angular.module('MainController', ['UserService']).controller('MainController', function($scope, UserService) {
    /*
     * Example api call when user tries to login to their account.
     */ 
    // UserService.authenticateUser("RandyHeRH@gmail.com", "starcraft", function(error, success) {
    //     if (error) {
    //         // invalid credentials
    //     } else {
    //         console.log(success); // valid credentials
    //     }
    // });

    /*  
     * Example api call when user tries to register an account.
     * Call API to get the specified username and see if an account with that username already exists.
     *   - If account exists, cannot create the account.
     *   - If account does not exist, can create the account. Call thee API for creating user.
     */
    // createUser("RandyHe@gmail.com", "birdkicker", "starcraft");
    // function createUser(email, username, password, callback) {
    //     UserService.getUser(email).then(function(response) {
    //         // user exists, don't create the account
    //     }, function(error) {
    //         // cannot find a user with specified username, create account
    //         UserService.createUser(email, username, password, function(res) {
    //             console.log(res);
    //         });
    //     });
    // }
});