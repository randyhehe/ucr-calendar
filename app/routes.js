var User = require('./models/user');

module.exports = function(app) {
    app.get('/api/users', function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);
            res.json(users);
        });
    });

    app.get('/api/users/:username', function(req, res) {
        User.find({
            username: req.params.username
        }, function(err, users) {
            let userExists = (users.length !== 0);
            if (!userExists) res.send(404);
            else res.send("information about the username");
        });
    });

    app.post('/api/users', function(req, res) {
        var newUser = new User({ username: req.query.username, password: req.query.password });
        newUser.save(function(err, newUser) {
            if (err) return console.error(err);
            res.send("useful json");
        });
    });

    app.get('/', function(req, res) {
        res.sendfile('./public/index.html');
    });
}