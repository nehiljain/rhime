var passport = require('passport');
var pocketApiController = require('../controllers/pocketApi');

require('../config/passport');
require('../config/pocketPassport');

module.exports = function(app) {

app.get('/auth/pocket', passport.authenticate('pocket',{failureRedirect : '/'}), function(req, res) {
	console.log('auth/pocket successful');
	res.redirect('/connect/pocket');
});
app.get('/auth/pocket/callback', passport.authenticate('pocket', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/connect/pocket');
	});

app.get('/connect/pocket', app.middlewares.isAuthenticated, app.middlewares.isPocketAuthorized, pocketApiController.connectPocket);
app.get('/sync/pocket', app.middlewares.isAuthenticated, app.middlewares.isPocketAuthorized, pocketApiController.syncPocket);
app.get('/v1/stats/pocket/:email/daily_count/:article_status', app.middlewares.isAuthenticated, app.middlewares.isPocketAuthorized, pocketApiController.dailyCount);

}