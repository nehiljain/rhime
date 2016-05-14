var mongoose = require('mongoose');


var articleSchema = new mongoose.Schema({
  item_id: { type: String, unique: true },
  given_url: String,
  given_title: String,
  word_count: Number,
  tags: Array,
  authors: Array,
  has_image: Number,
  has_video: Number,
  resolved_url: String,
  resolved_title: String,
  events: Array,
  email : String
});


var Article = mongoose.model( 'Article',articleSchema)

module.exports = Article;