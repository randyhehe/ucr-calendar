var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    }, username: {
        type: String,
        required: true,
    }, password: {
        type: String,
        required: true
    }
});

// prehook using bcrypt to hash and salt passwords 
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

// authenticate email and password using bcrypt
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ email: email })
    .exec(function(err, user) {
        if (err) {
            return callback(err);
        } else if (!user) {            
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }        
        bcrypt.compare(password, user.password, function(err, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                var err = new Error('Invalid password.');
                err.status = 401;
                return callback(err);
            }
        });
    });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;