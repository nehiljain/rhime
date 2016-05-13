
var passport = require('passport');
var PocketStrategy = require('passport-pocket');

var User = require('../models/User');

passport.use( 'pocket', new PocketStrategy({
    consumerKey    : process.env.POCKET_CONSUMER_KEY,
    callbackURL    : process.env.POCKET_CALLBACK_URL
  },function(req, username, accessToken, done) {
    
    console.log("passport-pocket",req.user, arguments);

    User.findById(req.user._id, function(err, user) {
      user.tokens.push({ kind: 'pocket', accessToken: accessToken });
      user.save(function(err) {
        done(err, user);
      });
    });
    /*process.nextTick(function () {
      return done(null, {
        username    : username,
        accessToken : accessToken
      });
    });*/
  })
);