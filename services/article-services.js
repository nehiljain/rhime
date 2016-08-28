'use strict';

let articleDAO = require('../DAO/article-dao');
var timestamp = require('unix-timestamp');
var _ = require('lodash');

let getArticles = function(emailId){

	var USER_WORD_COUNT = 200;
	return articleDAO.getArticlesByEmail(emailId)
	.then(function(articles){
		if(!articles){
			return Promise.reject(new Error("no articles found for this emailId"))
		}
		var timeRequired = 0;
		var sortedArticles = [];
		if ( !!articles.length ){
			articles.forEach( function(item){
				item.final_title = item.resolved_title || item.given_title ||  item.resolved_url || 'Article';
				item.estimatedTime = Math.ceil(item.word_count/ USER_WORD_COUNT);
				timeRequired += item.estimatedTime;
				//debug(item.time_added, item.word_count)
				item.timeAdded = timestamp.toDate(Number( item.time_added))
			});

			sortedArticles = _.sortBy(articles, function(o) { return o.sort_id; });
		}

		return Promise.resolve(sortedArticles)
	})
	.catch(function(err){
		console.log(err.stack)
		return Promise.reject(err)
	})
}


exports.getArticles = getArticles