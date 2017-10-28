// modules
let express = require('express');
let session = require('express-session');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let mongoose = require('mongoose');
let routes = require('./app/routes.js');
let config = require('./config/config');

// connect to mongoDB database
mongoose.connect(config.databaseUrl);

// app config
let port = process.env.PORT || 8080;
app.use(bodyParser.json()); 
app.listen(port);
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'This secret is used to help promote security.',
    resave: true,
    saveUninitialized: false
}));
app.use('/', routes);
// start app
console.log('Listening on port: ' + port);

exports = module.exports = app;

