/**
 * Controllers (route handlers).
 */
var homeController = require('../controllers/home');
var userController = require('../controllers/user');
var apiController = require('../controllers/api');
var contactController = require('../controllers/contact');
var dashboardController = require('../controllers/dashboard')

//var multer = require('multer');
//var path = require('path');
//var upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * API keys and Passport configuration.
 */
var passportConfig = require('../config/passport');
require('../config/pocketPassport')
require('../config/facebookPassport')
require('../config/googlePassport')

var passport = require('passport');

module.exports = function(app) {

	/**
	 * Primary app routes.
	 */
	app.get('/', homeController.index);
	app.get('/login', userController.getLogin);
	app.post('/login', userController.postLogin);
	app.get('/logout', userController.logout);
	app.get('/forgot', userController.getForgot);
	app.post('/forgot', userController.postForgot);
	app.get('/reset/:token', userController.getReset);
	app.post('/reset/:token', userController.postReset);
	app.get('/signup', userController.getSignup);
	app.post('/signup', userController.postSignup);
	app.get('/contact', contactController.getContact);
	app.post('/contact', contactController.postContact);
	app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
	app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
	app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
	app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
	app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

	app.get('/dashboard',dashboardController.index);


	/**
	 * API examples routes.
	 */
	//app.get('/api', apiController.getApi);
	//app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
	//app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
	app.get('/api/pocket', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPocket);

	/**
	 * OAuth authentication routes. (Sign in)
	 */
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});

	app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});

	/**
	 * OAuth authorization routes. (API examples)
	 */
	app.get('/auth/pocket', passport.authenticate('pocket',{failureRedirect : '/'}), function(req, res) {
	 res.redirect('/api/pocket');
	});
	app.get('/auth/pocket/callback', passport.authenticate('pocket', { failureRedirect: '/login' }),
	function(req, res) {
	    res.redirect('/api/pocket');
	});

	//Route not found -- Set 404
	app.get('*', function(req, res) {
	    res.json({
	        'route': 'Sorry this page does not exist!'
	    });
	});

}