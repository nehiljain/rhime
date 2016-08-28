'use strict';
let mongoose = require('mongoose');
let Article = mongoose.model('Article')

let getArticlesByEmail = function(emailId){
	return Article.find({}).where({'email':emailId,'status':"0"}).exec();
} 


exports.getArticlesByEmail = getArticlesByEmail