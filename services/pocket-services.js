
'use strict';

let request = require('request')
var rp = require('request-promise');

let mongoose = require('mongoose')
let Article = mongoose.model('Article')
let User = mongoose.model('User')
let _ = require('lodash');
var debug = require('debug')('rhime:services:pocket');

let syncPocket = function( user,qs){
	//debug('queryString: ', qs);
	var latestPocketSync = new Date().toISOString();
	return rp({
		uri: 'https://getpocket.com/v3/get',
		qs: qs
	}).then(function(body){
		var response = JSON.parse(body);
		var articleList = []
		if ( !response ){
			return Promise.reject();
		}

		Object.keys( response.list ).forEach( function(item){
			articleList.push (
				Object.assign({}, response.list[item], {email : user.email })
			)
		})

		var bulk = Article.collection.initializeUnorderedBulkOp();


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
			return bulk.execute(function(err, bulkres){
				if (err) {
					return Promise.reject(err);
				}
				debug( 'bulk update!', bulkres);
				return User.update( { _id : user._id }, {lastPocketSync: latestPocketSync}).exec();
				/* , function(err, user){
					res.json({
						status: 'success'
					});
					debug('user : ', user);

				})*/
			});
		}
		return User.update( { _id : user._id }, {lastPocketSync: latestPocketSync} ).exec();
	})
	.catch(function(err){
		return Promise.reject(err);
	});
}

exports.syncPocket = syncPocket;