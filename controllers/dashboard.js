var User = require('../models/User');



exports.index = function(req,res,next){
	if (  !!req.user ){
		User.findById(req.user._id, function(err, user) {
	  		var pocketConnected = false;
	  		var accessToken = '';
	    	user.tokens.forEach(function(item){
	    		if ( item.kind == 'pocket' ){
	    			pocketConnected = true;
	    			accessToken = item.accessToken
	    		}
	    	})
	    	res.render('dashboard',{
	  			pocketConnected: pocketConnected,
	  			accessToken : accessToken,
	  			title : 'Dashboard'
		    })
	    });
	} else {
		res.redirect('/');
	}
}


