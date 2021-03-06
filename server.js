// modules
let express = require('express');
let session = require('express-session');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let mongoose = require('mongoose');
let routes = require('./src/server/routes/routes.js');
let config = require('./src/server/config/config.js');
let jwt = require('jsonwebtoken');

// connect to mongoDB database
mongoose.connect(config.databaseUrl);

// app config
let port = process.env.PORT || 8080;
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/src/client'));
app.use(session({
    secret: 'This secret is used to help promote security.',
    resave: true,
    saveUninitialized: false
}));
app.use('/', routes);

// start server
let server = app.listen(port);
console.log('Listening on port: ' + port);

// start socket connection
require('./src/server/socket.js')(server);

exports = module.exports = app;

