var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    username: {type: String},
    password: {type: String}
});