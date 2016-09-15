var homeController = require('../controllers/home');
var userController = require('../controllers/user');
var contactController = require('../controllers/contact');
var dashboardController = require('../controllers/dashboard')

module.exports = function(app) {

	//console.log(app.middlewares)
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
}