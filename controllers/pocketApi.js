var debug = require('debug')('rhime:controller:api');
var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var Article = require('../models/Article');
var User = require('../models/User');

var util = require('util');


var status_map = {
	'unread' : '0',
	'0' : '0',
	'read' : '1',
	'archived' : '1',
	'1' : '1',
	'deleted' : '2',
	'2' : '2' 
};




var dateFromDay = function(year, day) {
	var date = new Date(year, 0);
	var result_date = new Date(date.setDate(day));
	console.log(result_date);
	return result_date.toString("yyyy-MM-dd");
};

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
};

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
                                record[key] = new Date(record[key]*1000);
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





/*
	
	Metrics:
	daily_count for a user and given article status
	allowed status
	unread, read, archived, deleted or 0,1,2
	Daily Count API
	GET /v1/stats/pocket/{user_id}/daily_count/{article_status}
	?&start-date=2016-04-02
	&end-date=2016-08-01
	TODO: Implement Tag filtering
 */

exports.dailyCount = function(req, res, next){
    debug('daily_count');

    var start_date = !!req.query['start-date'] ? new Date(req.query['start-date']) : new Date("2005-01-01");
    var end_date = !!req.query['end-date'] ? new Date(req.query['end-date']) : new Date("2100-01-01");
    if (!!req.params.article_status && req.params.article_status in status_map) {
    	var article_status = status_map[req.params.article_status];
    } else {
    	console.error(err.stack);
  		res.status(500).send('Query is incorrect');
    }

	Article.aggregate([
		{
			$match: {
						$and: [
	                        {email: req.params.email},
	                        {status : article_status},
	                        {time_added: {$gte: start_date}},
	                        {time_added: {$lte: end_date}}
	                       ]
              		}
		},
		{
			$group: {
					_id: {
							"email": "$email",
							"year" : {
		                        $year : "$time_added"
		                    },
		                    "dayOfYear" : {
		                        $dayOfYear : "$time_added"
		                    }
	                },
				count :  {$sum: 1}
			}
		}
	], function (err, db_res) {
        if (err) {
            next(err);
        } else {
        	debug('result', result);
        	var result = [];
        	db_res.forEach( function(record) {
        		var record_date = moment(record._id.year+ ":" + record._id.dayOfYear, "YYYY:DDDD");
        		result.push({
        			id: record._id.email,
        			date: moment(record_date).format("YYYY-MM-DD"),
        			count: record.count
        		});
        	});
            res.json(result);
        }
    });
};




