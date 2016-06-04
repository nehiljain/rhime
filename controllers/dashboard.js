var debug = require('debug')('rhime:controller:dashboard');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var DashboardHeader = React.createFactory(require('../app/components/dashboard/DashboardHeader.jsx'));
var User = require('../models/User');
var Article = require('../models/Article');

var _ = require('lodash');
var timestamp = require('unix-timestamp');

exports.index = function(req,res,next){
	
	if (  !!req.user || !!req.user.email ){
		
		var USER_WORD_COUNT = 200;
		debug('user from req object-->',req.user);

		//User.findById(req.user._id, function(err, user) {
  		var pocketConnected = false;
  		var accessToken = '';

    	req.user.tokens.forEach( function(item){
    		if ( item.kind == 'pocket' ){
    			pocketConnected = true;
    			accessToken = item.accessToken;
    		}
    	});

    	Article.find({}).where({'email':req.user.email,'status':"0"}).exec( function(err,articles){
    		var timeRequired = 0;
            var sortedArticles = [];
    		if ( !!articles.length ){
    			articles.forEach( function(item){
    				item.final_title = item.resolved_title || item.given_title ||  item.resolved_url || 'Article';
    				item.estimatedTime = Math.ceil(item.word_count/ USER_WORD_COUNT);
    				timeRequired += item.estimatedTime;
    				//debug(item.time_added, item.word_count)
    				item.timeAdded = timestamp.toDate(Number( item.time_added))
    			});

    			sortedArticles = _.sortBy(articles, function(o) { return o.sort_id; });

    		}
    		
    		debug('found articles!');
			
			var dashboardHeaderHtml = ReactDOMServer.renderToString(DashboardHeader({
				title : 'Dashboard',
				pocketConnected: pocketConnected,
	  			accessToken : accessToken
			}));

    		res.render('dashboard',{
    			dashboardHeaderHtml : dashboardHeaderHtml,		  				  			
	  			articleCount : sortedArticles.length,
	  			timeRequired : timeRequired,
	  			articles : sortedArticles
		    });
    	});
	} else {
		res.redirect('/');
	}
};
