import {LOAD_MESSAGES} from '../actions/index';
import {LOAD_MESSAGES_BY_DATE_RANGE} from '../actions/index';

function mergeMessages(olderMessages, existingMessages) {
  if (existingMessages.length == 0) {
    return olderMessages;
  }
  var oldestExistingDate = existingMessages[0].date;
  if (olderMessages.length == 0 || olderMessages[olderMessages.length - 1].date < oldestExistingDate) {
    return olderMessages.concat(existingMessages);
  } else {
    // can update findIndex to binary search since messages are sorted
    var cutOffForOlderMessages = olderMessages.findIndex((message) => {message.date == oldestExistingDate});
    return olderMessages.slice(0, cutOffForOlderMessages).concat(existingMessages);
  }
}

export default function(state=[], action) {
  switch(action.type) {
    case LOAD_MESSAGES:
    case LOAD_MESSAGES_BY_DATE_RANGE:
      var olderMessages = action.payload.data.messages.reverse(); // from old to new after reverse
      if (state.length > 0 && olderMessages[olderMessages.length - 1].date > state[0].date) {
        return mergeMessages(olderMessages, state);
      }
      return olderMessages.concat(state);
  }
  return state;
}
