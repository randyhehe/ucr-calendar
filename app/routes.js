var User = require('./models/user');

module.exports = function(app) {
    // If email does not exist, returns 404. Otherwise, returns information on the user.
    app.get('/api/users/:email', function(req, res) {
        User.find({
            email: req.params.email
        }, function(err, users) {
            let userExists = (users.length !== 0);
            if (!userExists) res.send(404);
            else res.send(users);
        });
    });

    // Creates a user with the specified email, username, and password.
    app.post('/api/users', function(req, res) {
        if (req.body.email && req.body.username && req.body.password) {
            var userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            };

            User.create(userData, function(err, user) {
                if (err) {
                    return res.send(err);
                } else {
                    return res.send(user);
                }
            });
        } else {
            return res.send("Error: Invalid body.");
        }
    });

    // Authenticate user with specified email and username. 401 HTTP Response on invalid credentials.
    app.post('/api/users/auth', function(req, res) {
        if (req.body.email && req.body.password) {
            User.authenticate(req.body.email, req.body.password, function(err, result) {                
                if (err) {
                    return res.send(401);
                } else {
                    return res.send(result);
                }
            });
        } else {
            return res.send("Error: Invalid body.");
        }
    });

    app.get('/', function(req, res) {
        res.sendfile('./public/index.html');
    });
}