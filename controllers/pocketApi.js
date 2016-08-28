var debug = require('debug')('rhime:controller:api');
var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var Article = require('../models/Article');
var User = require('../models/User');

var util = require('util');

/* services */
var pocketServices = require('../services/pocket-services');
var articleServices = require('../services/article-services');


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

		return pocketServices.syncPocket(req.user,qs)
		.then(function(response){
			console.log('pocketServices',response, req.user.email);
			return articleServices.getArticles(req.user.email)
			.then(function(articles){
				res.json({
					articles: articles
				})
			})
		})
		.catch(function(err){
			console.log(err);
			res.json({
				message : 'sync failed.'
			})
		})
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




