let mongoose = require('mongoose');

let FriendRequestSchema = new mongoose.Schema({
    receiver: {
        type: String,
        required: true
    }, sender: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

let FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
module.exports = FriendRequest;