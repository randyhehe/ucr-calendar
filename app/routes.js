let User = require('./models/user');
let jwt = require('jsonwebtoken');
let express = require('express');
let router = express.Router();
let config = require('../config/config');

// JWT Authenticator that is used as middleware for some API calls requiring a valid token.
let jwtAuthenticator = function(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.tokenSecret, function(err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                console.log(req.decoded);
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        })
    }
}

// Returns true or false depending on an email with the email already exists.
router.get('/api/users/exists/:email', function(req, res) {
    User.find({
        email: req.params.email
    }, function(err, users) {
        let userExists = (users.length !== 0);
        if (!userExists) return res.json({ exists: false });
        else return res.json({ exists: true });
    });
});

// Creates a user with the specified email, username, and password.
router.post('/api/users', function(req, res) {
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
router.post('/api/users/auth', function(req, res) {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function(err, result) {                
            if (err) {
                return res.status(401).send({
                    succees: false,
                    message: "Invalid credentials."
                });
            } else {
                var payload = { email: req.body.email };
                var token = jwt.sign(payload, config.tokenSecret, { expiresIn: '24h' });
                
                return res.json({
                    success: true,
                    token: token
                });
            }
        });
    } else {
        return res.send("Error: Invalid body.");
    }
});

// Returns user information from JWT token.
router.get('/api/users/me', jwtAuthenticator, function(req, res) {
    User.find({
        email: req.decoded.email // decode and get the email from the provided token
    }, function(err, user) {
        let userExists = (user.length !== 0);
        if (!userExists) return res.json({ success: false });
        else return res.json({
            success: true,
            user: user
        })
    });
});

router.get('/*', function(req, res) {
    res.sendfile('./public/index.html');
});

module.exports = router;