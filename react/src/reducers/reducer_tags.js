import {ADD_TAG, LOAD_TAG, DELETE_TAG} from '../actions/index';

export default function(state=null, action) {
  switch(action.type) {
    case ADD_TAG:
      var tagReturned = action.payload.data;
      if (!state) {
        return [tagReturned];
      }
      var changedTagIndex = state.findIndex((tag) => {
        return tag.tagName == tagReturned.tagName;
      });
      if (changedTagIndex == -1) {
        return state.concat(tagReturned);
      } else {
        var result = JSON.parse(JSON.stringify(state)); // deep copy
        result[changedTagIndex] = tagReturned;
        return result;
      }
    case DELETE_TAG:
      // delete message from tag object, not necessarily delete tag object
      var tagReturned = action.payload.data; // can be null
      if (!state) {
        return state;
      }
      var changedTagIndex = state.findIndex(tag => tag.tagName == action.meta.tagName);
      if (changedTagIndex == -1) {
        return state;
      }
      var result = JSON.parse(JSON.stringify(state)); // deep copy
      if (!tagReturned) { // tag should be deleted
        result.splice(changedTagIndex, 1);
        return result;
      } else { // tag should be updated
        result[changedTagIndex] = tagReturned;
        return result;
      }
    case LOAD_TAG:
      return action.payload.data.tags;
  }
  return state;
}
