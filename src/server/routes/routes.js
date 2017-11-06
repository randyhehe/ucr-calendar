let User = require('../models/user');
let CalendarEvent = require('../models/calendarevent');
let jwt = require('jsonwebtoken');
let express = require('express');
let router = express.Router();
let config = require('../config/config');
let bcrypt = require('bcrypt');

// JWT Authenticator that is used as middleware for some API calls requiring a valid token.
let jwtAuthenticator = function(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.tokenSecret, function(err, decoded) {
            if (err) {
                return res.status(403).send({success: false, message: 'Failed to authenticate token.'});
            } else {
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

// Returns true or false depending if the username or email exists
router.get('/api/users/exists/:user', function(req, res) {
    User.findOne({
        $or: [{email: req.params.user}, {username: req.params.user}]
    }, function(err, user) {
        if (err) {
            return res.status(500).send({success: false, message: 'Unable to check if username or email exists.'});                      
        } else if (user === null) {
            return res.json({success: true, exists: false});            
        } else {
            return res.json({success: true, exists: true});
        }
    });
});

// Creates a user with the specified email, username, and password.
router.post('/api/users', function(req, res) {
    if (req.body.email && req.body.username && req.body.password) {
        // username verification here. make sure a-z A-Z 0-9
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(req.body.username)) {
            return res.status(400).end({success: false, message: 'Username can only contain characters from A-Z, a-z, and 0-9'});
        }

        bcrypt.hash(req.body.password, 10, function(err, hash) {
            let userData = {
                email: req.body.email,
                username: req.body.username,
                password: hash,
                events: [],
                friends: []
            };
            User.create(userData, function(err, user) {
                if (err) {
                    return res.status(500).send({success: false, message: 'Unable to create user.'});
                } else {
                    return res.send({success: true, user: user});
                }
            });
        });
    } else {
        return res.send(400).send({success: false, message: 'Invalid body.'});
    }
});

// Authenticate user with specified email/username and password. 401 HTTP Response on invalid credentials.
router.post('/api/users/auth', function(req, res) {
    if (req.body.user && req.body.password) {
        User.authenticate(req.body.user, req.body.password, function(err, user) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid credentials."
                });
            } else {
                let payload = {username: user.username};
                let token = jwt.sign(payload, config.tokenSecret, {expiresIn: '24h'});
                
                return res.json({
                    success: true,
                    token: token
                });
            }
        });
    } else {
        return res.send(400).send({success: false, message: 'Invalid body.'});
    }
});

// Returns user information from JWT token. This route may not be necessary and can be removed later.
router.get('/api/users/me', jwtAuthenticator, function(req, res) {
    User.findOne({
        username: req.decoded.username
    }, function(err, user) {
        if (err || user === null) {
            return res.status(400).send({success: false, message: 'Unable to find user with the specified username.'});
        } else {
            user = user.toObject();
            delete user["_id"];
            delete user["password"];
            return res.json({success: true, user: user});
        }
    });
});

// Returns all events from a user defined from a JWT token
router.get('/api/events/me', jwtAuthenticator, function(req, res) {
    User.findOne({
        username: req.decoded.username
    }, function(err, user) {
        if (err || user === null) {
            return res.status(400).send({success: false, message: 'Unable to find user with the specified username.'});
        } else {
            return res.json({success: true, events: user.events})
        }
    });
});

// Create event and assign it to the user specified by the token
router.post('/api/events', jwtAuthenticator, function(req, res) {
    if (req.body.name, req.body.startTime, req.body.endTime, req.body.description, req.body.public) {
        User.findOne({
            username: req.decoded.username
        }, function(err, user) {
            if (err || user === null) {
                return res.status(400).send({success: false, message: 'Unable to find user with the specified username.'});
            } else {
                let newEvent = new CalendarEvent({
                    name: req.body.name,
                    user: user.username,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    description: req.body.description,
                    public: req.body.public,
                });
                user.events.push(newEvent);
                user.save(function(err) {
                    if (err) {
                        res.status(500).send({success: false, message: 'Unable to add event.'});
                    } else {
                        res.json({success: true});
                    }
                });
            }
        });
    } else {
        return res.send(400).send({success: false, message: 'Invalid body.'});
    }
});

// Add friend... later add another API to request before being able to add immediately.
router.post('/api/friends', jwtAuthenticator, function(req, res) {
    if (req.body.username && (req.body.username !== req.decoded.username)) {
        User.findOne({
            username: req.decoded.username
        }, function(err, currUser) {
            if (err || currUser === null) {
                return res.status(400).send({success: false, message: 'Unable to find user with the specified username.'});                
            } else if (currUser.friends.includes(req.body.username)) {
                return res.status(400).send({success: false, message: 'Cannot add existing friend.'});
            } else {
                User.findOne({
                    username: req.body.username
                }, function(err, otherUser) {
                    if (err || otherUser === null) {
                        return res.status(400).send({success: false, message: 'Unable to find user with the specified username.'});   
                    } else {
                        currUser.friends.push(req.body.username);
                        currUser.save(function(err) {
                            if (err) {
                                res.status(500).send({success: false, message: "Unable to add friend."});
                            } else {
                                otherUser.friends.push(req.decoded.username);
                                otherUser.save(function(err) {
                                    if (err) {
                                        res.status(500).send({success: false, message: "Unable to add friend."});
                                    } else {
                                        res.json({success: true});
                                    }
                                });  
                            }
                        }); 
                    }
                });   
            }   
        });
    } else if (req.body.username && (req.body.username === req.decoded.username)) {
        return res.status(400).send({success: false, message:  'Cannot add own account as friend.'});
    } else {
        return res.status(400).send({success: false, message: 'Invalid body.'});
    }
});

router.get('/api/friends/me', jwtAuthenticator, function(req, res) {
    User.findOne({
        username: req.decoded.username
    }, function(err, user) {
        if (err || user === null) {
            return res.status(400).send({success: false, message: 'Unable to find user with the specified username.'});
        } else {
            return res.json({success: true, friends: user.friends});
        }
    });
});

router.get('/api/friends/events', jwtAuthenticator, function(req, res) {
    User.findOne({
        username: req.decoded.username
    }, function(err, user) {
        if (err || user === null) {
            return res.status(400).send({success: false, message: 'Unable to find user with the specified username.'});
        } else {
            User.find({
                username: {$in: user.friends}
            }, function(err, users) {
                if (err) {
                    return res.status(400).send({success: false, message: 'Unable to find user with the specified usernames.'});
                } else {
                    let events = [];
                    for (let i = 0; i < users.length; i++) {
                        events.push(...users[i].events);
                    }
    
                    events.sort(function(eventA , eventB) {
                        return new Date(eventA.createdAt) - new Date(eventB.createdAt);
                    });
                    return res.json({success: true, events: events});
                }
            });
        }
    });
});

router.get('/*', function(req, res) {
    res.sendfile('./src/client/index.html');
});

module.exports = router;