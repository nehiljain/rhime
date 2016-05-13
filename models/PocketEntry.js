var mongoose = require('mongoose');


var pocketEntrySchema = new mongoose.Schema({
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
  events: Array
});