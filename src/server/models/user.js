let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let CalendarEventSchema = require('./calendarevent.js').schema;
let FriendRequestSchema = require('./friendrequest.js').schema;

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    }, username: {
        type: String,
        required: true
    }, password: {
        type: String,
        required: true
    }, events: {
        type: [CalendarEventSchema],
        required: false
    }, friends: {
        type: [String],
        required: false
    }, friendRequests: {
        type: [FriendRequestSchema],
        required: false
    }
}, {minimize: false});

// authenticate email and password using bcrypt. Case sensitive username, casing does not matter for emails
UserSchema.statics.authenticate = function(loginUser, loginPassword, callback) {
    User.findOne({$or: [{email: loginUser.toLowerCase()}, {username: loginUser}]})
    .exec(function(err, user) {
        if (err) {
            return callback(err);
        } else if (!user) {            
            let err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        
        bcrypt.compare(loginPassword, user.password, function(err, result) {
            if (result) {
                return callback(null, user);
            } else {
                let err = new Error('Invalid password.');
                err.status = 401;
                return callback(err);
            }
        });
    });
};

let User = mongoose.model('User', UserSchema);
module.exports = User;