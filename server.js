/**
 * Module dependencies.
 */
var express = require('express');

var session = require('express-session');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var fs = require('fs')


/* Dont know*/
var compress = require('compression');
var lusca = require('lusca');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');



var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');

//require('node-jsx').install();
require('node-jsx').install({extension: '.jsx'});


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: '.env' });

var debug = require('debug')('rhime:server');


/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Disable etag headers on responses
app.disable('etag');

app.use(compress());

app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(session({
  resave: true,
  saveUninitialized: true,
  unset : 'destroy',
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*app.use(function(req, res, next) {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
*/

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function(req, res, next) {
  // After successful login, redirect back to /api, /contact or /
  if (/(api)|(contact)|(^\/$)/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

fs.readFile('webpack-assets.json','utf8',function(err,contents){
	if( err) {return }
	var contents = JSON.parse(contents)
        app.mainJsFile = contents.main.js;
})

app.middlewares = require('./middlewares');

app.use(function(req,res,next){
  req.mainJsFile = app.mainJsFile
  //console.log(req.session);
  next();
})
require('./routes/index')(app);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  debug('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
