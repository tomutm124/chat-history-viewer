var mongoose = require('mongoose');

var Message = mongoose.model('Message', {
  messageType: {
    type: String,
  },
  media: {
    type: String,
  },
  content: {
    type: String,
  },
  date: {
    type: Number
  }
});

module.exports = {Message};
