var _ = require('lodash');
var debug = require('debug')('rhime:middleware');
/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isPocketAuthorized = function(req, res, next) {

	var provider = req.path.split('/').slice(-1)[0];
	//having tokens in DB or session is valid.
	if ( provider != 'pocket' ){
		throw new Error('provider is NOT pocket for this request. Check code.')
	}


	if( _.find(req.user.tokens, { kind: provider }) || (!!req.session.pocketData && !!req.session.pocketData.accessToken)  ) {
		debug("Authorized already: ",req.session.pocketData, req.user.tokens)
		return next();
	} else {
		res.redirect('/auth/' + provider);
		return;
	}
};