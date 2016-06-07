var debug = require('debug')('rhime:controller:api');
var _ = require('lodash');
var async = require('async');

var Article = require('../models/Article');
var User = require('../models/User');

/*
	GET /connect/pocket
*/

exports.connectPocket = function(req, res, next){
	
	var token = _.find(req.user.tokens, { kind: 'pocket' });

	if ( !!token && !!token.accessToken ) {
		res.render('statusPage',{
			'title' : 'successfully connected your pocket account !'
		})
	} else {
		res.render('statusPage',{
			title : 'Error! failed connecting your pocket account. Try again, later'
		})

	}
}

/*
	GET /sync/pocket
*/
exports.syncPocket = function(req, res, next) {
	request = require('request');

	var token = _.find(req.user.tokens, { kind: 'pocket' });

	debug('syncing pocket...' , token);

	if ( !!token && !!token.accessToken ) {

		var qs = {
			access_token: token.accessToken, 
			consumer_key: process.env.POCKET_CONSUMER_KEY, 
			count:"1000",
			state:"all",
			detailType:"complete"
		};

		if( !!req.user.lastPocketSync ) {
			qs.since = req.user.lastPocketSync;			
		}

		var latestPocketSync =  Math.round( new Date().getTime()/1000 );

		debug('queryString: ', qs);

		request.get({ 
			url: 'https://getpocket.com/v3/get', 
			qs: qs
			}, function(err, request, body) {
			if (err || request.statusCode !== 200) {
				return next(err);
			}
			var response = JSON.parse(body);
			var articeList = []
			if ( !response ){
				return next();
			}

			Object.keys( response.list ).forEach( function(item){
				articeList.push (
					Object.assign({}, response.list[item], {email : req.user.email })
					) 
			})

			var bulk = Article.collection.initializeUnorderedBulkOp();
			
			articeList.forEach(function(record){
				var query = {};
				query['item_id'] = record['item_id'];
				// bulk.find(query).upsert().updateOne( record );
				if (record['status'] === '2') {
					bulk.update(
						query,
						{
							$set: {
								"status": record["status"],
								"item_delete_approx": latestPocketSync,
								"email": record["email"]
							}
						},
						{
							upsert: true
						}
					);
				} else {
					bulk.update(
						query,
						record,
						{
							upsert: true
						}
					);
				}
			});
			if ( articeList.length != 0 ){
				bulk.execute(function(err, bulkres){
					if (err) return next(err);
					debug( 'bulk update!', bulkres);
					User.update( { _id : req.user._id }, {lastPocketSync: latestPocketSync}, function(err, user){
						res.json({
							status: 'success'
						});
						debug('user : ', user);

					})
				});
			} else {

				User.update( { _id : req.user._id }, {lastPocketSync: latestPocketSync}, function(err, user){
					res.json({
						status: 'success'
					});
					debug('user : ', user);

				})
			}

			/*Article.update(articeList, function(err,response,body){
				if (err){
					return next(err);
				}
				
				res.render('dashboard', {
					title: 'Data Synced',
					response: JSON.stringify(body)
				});

			})*/      
			
			//Article.collection.insert( articeList, function(err,request,body){
			
			//console.log('POCKET',response.list);
			
		});  
	}
	
};
