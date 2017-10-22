// modules
let express = require('express');
let session = require('express-session');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let mongoose = require('mongoose');

// mongoDB config 
let db = require('./config/db');
// connect to mongoDB database
mongoose.connect(db.url);

// app config
let port = process.env.PORT || 8080;
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'This secret is used to help promote security.',
    resave: true,
    saveUninitialized: false
}));
require('./app/routes')(app);
// start app
app.listen(port);
console.log('Listening on port: ' + port);

exports = module.exports = app;

