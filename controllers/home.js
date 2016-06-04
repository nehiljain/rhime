var debug = require('debug')('rhime:controller:home');
var User = require('../models/User');

/**
* GET /
*/

exports.index = function(req,res,next){
	debug(req.user)
	if ( !!req.user ) {
		res.redirect('/dashboard');
	} else {
		res.render('home',{
		})
	}
}