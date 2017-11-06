let mongoose = require('mongoose');
let User = require('./models/user');
let CalendarEvent = require('./models/calendarevent');

module.exports = function(server) {
    let io = require('socket.io').listen(server);

    io.on('connection', function(socket) {
        socket.on('subscribe', function(username) {
            console.log(username);
            socket.join(username);
        });

        // Get the user from the created event and notify all friends with the event information.
        socket.on('event', function(event) {
            console.log('event');
            console.log(event);
            User.findOne({
                username: event.user
            }, function(err, user) {
                if (!err && user !== null) {
                    let friends = user.friends;
                    for (let i = 0; i < friends.length; i++) {
                        io.in(friends[i]).emit('event', event);
                    }
                }
            });
        });
    });

    // setInterval(function() {
    //     io.in('birdkicker').emit('hi', 'works');
    // }, 1000);
    // // test end for socket.io

}