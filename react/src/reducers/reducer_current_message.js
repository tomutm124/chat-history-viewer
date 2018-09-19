import {SCROLL_TO} from '../actions/index';

export default function(state={content: "test"}, action) {
  switch(action.type) {
    case SCROLL_TO:
      var targetMessage = action.payload;
      var targetMessageElement = document.getElementById(targetMessage._id);
      targetMessageElement.scrollIntoView()
      return targetMessage;
  }

  return state;
}
