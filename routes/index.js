module.exports = function(app) {

	require('./account')(app)
	require('./pocket')(app)

	app.get('/status',function(req,res){
	 	res.render('statusPage',{
	 		title : 'Error! failed connecting your pocket account. Try again, later'
	 	});
	 });

	//Route not found -- Set 404
	app.get('*', function(req, res) {
		res.render('statusPage',{
	 		title : 'Oops! Something went wrong.'
	 	});

	});

}
