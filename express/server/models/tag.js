var mongoose = require('mongoose');

var Tag = mongoose.model('Tag', {
  tagName: {
    type: String,
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
});

module.exports = {Tag};
