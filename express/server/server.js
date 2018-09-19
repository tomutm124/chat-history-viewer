var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var {Message} = require('./models/message');
var {Tag} = require('./models/tag');

const PORT_TO_LISTEN_ON = 8000;
const MONGO_URL = 'mongodb://localhost:27017/ChatHistoryViewer';

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);

var app = express();
app.use(bodyParser.json());

// allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/messages', (req, res) => {
  var messages = req.body;
  if (!messages) {
    return res.status(400).send("Input list is empty");
  }
  var convertedMessages = messages.map(function(m) {
    m.date = dateStringToEpochTime(m.date);
    return m;
  });
  Message.insertMany(convertedMessages).then((doc) => {
    res.send({
      note: `Inserted ${doc.length} messages`
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/messages', (req, res) => {
  // console.log(req.query);
  number = parseInt(req.query.number)
  if (req.query.date) {
    date = parseInt(req.query.date)
    dateQuery = {date:{$lt: date}};
  } else {
    dateQuery = {};
  }
  Message.
    find(dateQuery).
    sort({date: -1}).
    limit(number).
    then((messages) => {
      // console.log(messages);
      res.send({
        messages
      });
    });
});

app.get('/search/messages', (req, res) => {
  date1 = req.query.date1;
  date2 = req.query.date2;
  Message.
    find({date:{$gte: date1, $lt: date2}}).
    sort({date: -1}).
    then((messages) => {
      // console.log(messages);
      res.send({
        messages
      });
    });
});

app.get('/search', (req, res) => {
  q = req.query.q;
  Message.
    find({content:{$regex: `.*${q}.*`}}).
    sort({date: -1}).
    then((messages) => {
      // console.log(messages);
      res.send({
        messages
      });
    });
});

app.post('/tags/create', (req, res) => {
  var tagName = req.body.tagName;
  var messageId = req.body.messageId;

  Tag.findOne({tagName}).then((doc) => {
    if (!doc) {
      console.log("Creating new tag " + tagName);
      var newTag = new Tag({
        tagName: tagName,
        messages: [messageId]
      });
      newTag.save().then((tag) => {
        sendTagWithMessages(tag._id, res)
      }, (e) => {
        res.status(400).send(e);
      });
    } else {
      console.log("Adding message to existing tag " + tagName);
      doc.messages.push(messageId);
      doc.save().then((tag) => {
        sendTagWithMessages(tag._id, res)
      }, (e) => {
        res.status(400).send(e);
      });
    }
  }).catch((e) => {
    res.status(400).send(e);
  });
});

function sendTagWithMessages(tagId, response) {
  Tag.findById(tagId)
    .populate('messages')
    .then((tagWithMessages) => {
      // console.log("tag with messages response:", tagWithMessages);
      response.send(tagWithMessages);
    })
}

app.get('/tags', (req, res) => {
  Tag.find({})
    .populate('messages')
    .then((tags) => {
      // console.log(messages);
      res.send({
        tags
      });
    });
});

app.post('/tags/delete', (req, res) => {
  var tagName = req.body.tagName;
  var messageId = req.body.messageId;

  Tag.findOne({tagName}).then((tag) => {
    if (!tag) {
        return res.status(400).send({error: "tag not found"});
    }
    targetMessageIndex = tag.messages.findIndex(id => id == messageId); // only messageIDs are in tag.messages
    if (targetMessageIndex == -1) {
      return res.status(400).send({error: "message not found for this tag"});
    }
    tag.messages.splice(targetMessageIndex, 1);
    if (tag.messages.length == 0) {
      Tag.deleteOne({tagName: tag.tagName}).then(() => {
        return res.send(null);
      });
    } else {
      tag.save().then((savedTag) => {
        sendTagWithMessages(savedTag._id, res)
      })
    }
  });
});

app.listen(PORT_TO_LISTEN_ON, () => {
  console.log('Started on port 8000');
});


function dateStringToEpochTime(original) {
  //original is in format is 11/2/2015 - 16:29:28
  originalSplit = original.split(' ');
  dateString = originalSplit[0];
  dateSplit = dateString.split('/').map(s => s.trim());
  timeString = originalSplit[2];
  timeSplit = timeString.split(':');

  year = dateSplit[2];
  month = dateSplit[1];
  day = dateSplit[0];
  hour = timeSplit[0];
  minute = timeSplit[1];
  second = timeSplit[2];

  dateObj = new Date(year, month-1, day, hour, minute, second);
  epoch = dateObj.getTime();
  return epoch;
}