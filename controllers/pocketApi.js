var debug = require('debug')('rhime:controller:api');
var _ = require('lodash');
var async = require('async');

var Article = require('../models/Article');
var User = require('../models/User');

/*
	GET /connect/pocket
*/

exports.connectPocket = function(req, res, next){
    debug('connectPocket....');
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
			qs.since = Math.round( Date.parse(req.user.lastPocketSync)/1000 );
		}

		var latestPocketSync = new Date().toISOString();

		debug('queryString: ', qs);

		request.get({
			url: 'https://getpocket.com/v3/get',
			qs: qs
			}, function(err, request, body) {
			if (err || request.statusCode !== 200) {
				return next(err);
			}
			var response = JSON.parse(body);
			var articleList = []
			if ( !response ){
				return next();
			}

			Object.keys( response.list ).forEach( function(item){
				articleList.push (
					Object.assign({}, response.list[item], {email : req.user.email })
					)
			})

			var bulk = Article.collection.initializeUnorderedBulkOp();

			/*
			{
				item_id: '1306626289',
				resolved_id: '1306626289',
				given_url: 'http://www.inc.com/lolly-daskal/11-ways-you-can-succeed-with-zero-talent.html',
				given_title: '',
				favorite: '0',
				status: '0',
				time_added: '1466736374',
				time_updated: '1466736371',
				time_read: '0',
				time_favorited: '0',
				sort_id: 1,
				resolved_title: '11 Ways You Can Succeed With Zero Talent',
				resolved_url: 'http://www.inc.com/lolly-daskal/11-ways-you-can-succeed-with-zero-talent.html',
				excerpt: 'Most people think in order to succeed you need talent. And it\'s true that for most business and management and leadership success you do need at least some degree of talent.  1. Believe in yourself.',
				is_article: '1',
				is_index: '0',
				has_video: '0',
				has_image: '0',
				word_count: '942',
				authors:
				{ '21537297':
				  { item_id: '1306626289',
				    author_id: '21537297',
				    name: 'Lolly Daskal',
				    url: 'http://www.inc.com/author/lolly-daskal' }
				   },
				email: 'b@b.com'
				}
			}
			*/
			articleList.forEach(function(record){
				console.log(record);
				var query = {};
				query['item_id'] = record['item_id'];

                    ['time_read', 'time_updated','time_added'].forEach(function(key) {
                         if(!!record[key] && record[key] != '0' && _.isString(record[key])) {
                                record[key] = new Date(record[key]*1000).toISOString();
                         }
                    });

                if (record['status'] === '2') {
					bulk.find(query).upsert().updateOne({
							$set: {
								"status": record["status"],
								"time_deleted_approx": latestPocketSync,
								"email": record["email"]
							}
                    });
				} else {

					bulk.find(query).upsert().updateOne( record );
				}
			});
			if ( articleList.length != 0 ){
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
