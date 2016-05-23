var User = require('../models/User');

var Article = require('../models/Article');

var React = require('react');
var ReactDOMServer = require('react-dom/server');

var DashboardHeader = React.createFactory(require('../app/components/dashboard/DashboardHeader.jsx'));

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
				var dashboardHeaderHtml = ReactDOMServer.renderToString(DashboardHeader({
					title : 'Dashboard',
					pocketConnected: pocketConnected,
		  			accessToken : accessToken
				}));

				console.log(dashboardHeaderHtml);

	    		res.render('dashboard',{
	    			dashboardHeaderHtml : dashboardHeaderHtml,		  				  			
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
