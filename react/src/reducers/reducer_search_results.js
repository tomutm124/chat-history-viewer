import {SEARCH} from '../actions/index';

export default function(state=[], action) {
  switch(action.type) {
    case SEARCH:
      return action.payload.data.messages.reverse(); // from old to new after reverse
  }
  return state;
}
