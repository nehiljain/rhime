/**
 * Controllers (route handlers).
 */
 var homeController = require('../controllers/home');
 var userController = require('../controllers/user');
 var pocketApiController = require('../controllers/pocketApi');
 var contactController = require('../controllers/contact');
 var dashboardController = require('../controllers/dashboard')

//var multer = require('multer');
//var path = require('path');
//var upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * API keys and Passport configuration.
 */
 require('../config/passport');
 require('../config/pocketPassport');
//require('../config/facebookPassport')
//require('../config/googlePassport')

var passport = require('passport');

module.exports = function(app) {

console.log(app.middlewares)
	/**
	 * Primary app routes.
	 */
	 app.get('/', homeController.index);
	 app.get('/how-it-works',function(req,res){
	 	res.render('how',{
	 	})
	 });
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

	 app.get('/account', app.middlewares.isAuthenticated, userController.getAccount);
	 app.post('/account/profile', app.middlewares.isAuthenticated, userController.postUpdateProfile);
	 app.post('/account/password', app.middlewares.isAuthenticated, userController.postUpdatePassword);
	 app.post('/account/delete', app.middlewares.isAuthenticated, userController.postDeleteAccount);
	 app.get('/account/unlink/:provider', app.middlewares.isAuthenticated, userController.getOauthUnlink);

	 app.get('/dashboard',dashboardController.index);


	/**
	 * API examples routes.
	 */
	//app.get('/api', apiController.getApi);
	//app.get('/api/facebook', app.middlewares.isAuthenticated, app.middlewares.isPocketAuthorized, apiController.getFacebook);
	//app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
	//app.get('/api/pocket', app.middlewares.isAuthenticated, app.middlewares.isPocketAuthorized, apiController.syncPocket);
	app.get('/connect/pocket', app.middlewares.isAuthenticated, app.middlewares.isPocketAuthorized, pocketApiController.connectPocket);
	app.get('/sync/pocket', app.middlewares.isAuthenticated, app.middlewares.isPocketAuthorized, pocketApiController.syncPocket);

	/**
	 * OAuth authentication routes. (Sign in)
	 */
	//app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
	/*app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});*/

	/*app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});*/

	/**
	 * OAuth authorization routes. (API examples)
	 */
	 app.get('/auth/pocket', passport.authenticate('pocket',{failureRedirect : '/'}), function(req, res) {
	 	console.log('auth/pocket successful');
	 	res.redirect('/connect/pocket');
	 });
	 app.get('/auth/pocket/callback', passport.authenticate('pocket', { failureRedirect: '/login' }),
	 	function(req, res) {
	 		res.redirect('/connect/pocket');
	 	});

	 app.get('/status',function(req,res){
	 	res.render('statusPage',{
	 		title : 'Error! failed connecting your pocket account. Try again, later'
	 	})
	 });

	//Route not found -- Set 404
	app.get('*', function(req, res) {
		res.json({
			'route': 'Sorry this page does not exist!'
		});
	});

}
