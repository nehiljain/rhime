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
  email : String,
  time_updated: Date,
  time_added: Date,
  time_read: Date,
  time_deleted_approx: Date,
  status: String,
  sort_id: Number
});


var Article = mongoose.model('Article', articleSchema);

module.exports = Article;


/**
 * time_updared into isodate.
 */
articleSchema.pre('save', function(next) {
  var article = this;
  console.log('save handler called', article);
  if (article.isModified('time_updated')) {
    article.time_updated = article.convertToISO(article.time_updated);
    return next();
  }
  if (article.isModified('time_read')) {
    article.time_read = article.convertToISO(article.time_read);
    return next();
  }
  if (article.isModified('time_added')) {
    article.time_added = article.convertToISO(article.time_added);
    return next();
  }
  if (article.isModified('time_deleted_approx')) {
    article.time_deleted_approx = article.convertToISO(article.time_deleted_approx);
    return next();
  }
  next();
});

articleSchema.pre('update', function(next) {
  var article = this;
  console.log('Update article handler called', article);
  next();
});


articleSchema.methods.convertToISO = function(value) {
  if (!!value) {
    return NaN;
  }
  if (_.isNaN(Date.parse(value))) {
      value = new Date(record[key]*1000).toISOString();
      return value;
  }
  return new Date(value).toISOString();
};
