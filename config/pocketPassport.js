var _ = require('lodash');

var passport = require('passport');
var PocketStrategy = require('passport-pocket');

var User = require('../models/User');

passport.use( 'pocket', new PocketStrategy({
    consumerKey    : process.env.POCKET_CONSUMER_KEY,
    callbackURL    : process.env.POCKET_CALLBACK_URL
  },function(req, username, accessToken, done) {
    
    console.log("passport-pocket",req, arguments);

    User.findById(req.user._id, function(err, user) {

      _.remove(req.user.tokens , function(token){
        return token.kind == 'pocket'
      })

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