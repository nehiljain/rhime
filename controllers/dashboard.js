var debug = require('debug')('rhime:controller:dashboard');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var Dashboard = React.createFactory(require('../app/components/dashboard/Dashboard.jsx'));

/* Models */
var User = require('../models/User');
var Article = require('../models/Article');

/* services */
var articleServices = require('../services/article-services')


exports.index = function(req,res,next){
	
	if (  !!req.user && !!req.user.email ){
		
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

		return articleServices.getArticles(req.user.email)
		.then( function(articles){
			var dashboardState = {
				articles : articles,
				pocketConnected : pocketConnected,
				accessToken : accessToken,
				title : 'Dashboard'
			}

			debug('found articles:',dashboardState.articles.length );

			res.render('dashboard',{
				dashboardHtml : ReactDOMServer.renderToString(Dashboard( { dashboardState : dashboardState} )),
				state : JSON.stringify(dashboardState),
			});
		})
		.catch(function(err){
			console.log(err.stack)
			res.status(500).json({message:"server error"});
		})
	} else {
		res.redirect('/');
	}
};
