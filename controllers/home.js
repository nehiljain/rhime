var User = require('../models/User');

/**
*	GET /
*
*/

exports.index = function(req,res,next){
  console.log(req.user)
  if ( !!req.user ) {
  	res.redirect('/dashboard');
  } else {
    res.render('home',{
    })
  }
	
}