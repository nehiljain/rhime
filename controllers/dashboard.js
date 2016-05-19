var User = require('../models/User');

var Article = require('../models/Article');



exports.index = function(req,res,next){
	if (  !!req.user ){
		User.findById(req.user._id, function(err, user) {
	  		var pocketConnected = false;
	  		var accessToken = '';
	    	user.tokens.forEach( function(item){
	    		if ( item.kind == 'pocket' ){
	    			pocketConnected = true;
	    			accessToken = item.accessToken;
	    		}
	    	});

	    	Article.find({}).where({'email':req.user.email,'status':"0"}).exec( function(err,articles){
	    		var timeRequired = 0;
	    		if ( !articles.length ){
	    			articles = [];
	    		} else {

	    			articles.forEach( function(item){
	    				item.final_title = item.resolved_title || item.given_title ||  item.resolved_url || 'Article';
	    				item.estimatedTime = Math.ceil(item.word_count/ 200);
	    				timeRequired += item.estimatedTime;
	    			});
	    		}

	    		res.render('dashboard',{
		  			pocketConnected: pocketConnected,
		  			accessToken : accessToken,
		  			title : 'Dashboard',
		  			articleCount : articles.length,
		  			timeRequired : timeRequired,
		  			articles : articles
			    });
	    	});
	    });
	} else {
		res.redirect('/');
	}
};