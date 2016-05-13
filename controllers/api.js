var _ = require('lodash');
var async = require('async');

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


exports.getPocket = function(req, res, next) {
  request = require('request');

  var token = req.session.pocketData;//_.find(req.user.tokens, { kind: 'pocket' });
  //console.log(req.user.tokens)
  console.log(token)
  if ( !!token && !!token.accessToken ) {
    request.get({ 
      url: 'https://getpocket.com/v3/get', 
      qs: { 
        access_token: token.accessToken, 
        consumer_key: process.env.POCKET_CONSUMER_KEY, 
        count:"10",
        detailType:"complete" }
      }, function(err, request, body) {
      if (err) {
        return next(err);
      }
      console.log('POCKET',body);
      res.render('home', {
        title: 'Pocket API',
        response: JSON.stringify(body)
      });
    });  
  }
  
};