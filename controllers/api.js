var _ = require('lodash');
var async = require('async');

var Article = require('../models/Article');
/**
 * Split into declaration and initialization for better startup performance.
 */
var validator;
var cheerio;
var request;

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = function(req, res, next) {
  cheerio = require('cheerio');
  request = require('request');

  request.get('https://news.ycombinator.com/', function(err, request, body) {
    var $ = cheerio.load(body);
    var links = [];
    $('.title a[href^="http"], a[href^="https"]').each(function() {
      links.push($(this));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};

exports.getFileUpload = function(req, res, next) {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = function(req, res, next) {
  req.flash('success', { msg: 'File was uploaded successfully.'});
  res.redirect('/api/upload');
};


exports.syncPocket = function(req, res, next) {
  request = require('request');

  var token = _.find(req.user.tokens, { kind: 'pocket' });

  //console.log(req.user.tokens)
  console.log('syncPocket' , token)
  if ( !!token && !!token.accessToken ) {
    request.get({ 
      url: 'https://getpocket.com/v3/get', 
      qs: {
        access_token: token.accessToken, 
        consumer_key: process.env.POCKET_CONSUMER_KEY, 
        count:"1000",
        state:"all",
        detailType:"complete" }
      }, function(err, request, body) {
      if (err || request.statusCode !== 200) {
        return next(err);
      }

      console.log(body)
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
        bulk.find(query).upsert().updateOne( record );
      });
      bulk.execute(function(err, bulkres){
          if (err) return next(err);

          /*res.render('dashboard', {
            title: 'Data Synced',
            articles : []
          });*/
          res.json({
            status: 'success'
          });
          
      });

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
