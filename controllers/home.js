var User = require('../models/User');

/**
*	GET /
*
*/

exports.index = function(req,res,next){
  if ( !!req.user ) {
  	User.findById(req.user._id, function(err, user) {
  		var pocketConnected = false;
  		var accessToken = '';
    	user.tokens.forEach(function(item){
    		if ( item.kind == 'pocket' ){
    			pocketConnected = true;
    			accessToken = item.accessToken
    		}
    	})
    	res.render('home',{
  			pocketConnected: pocketConnected,
  			accessToken : accessToken,
  			title : 'Dashboard'
	    })
    });
  } else {
    res.render('home',{
      pocketConnected: false,
      accessToken : '',
      title : 'Dashboard'
    })
  }
	
}