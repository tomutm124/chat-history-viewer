import {SELECT_MESSAGE} from '../actions/index';

export default function(state=null, action) {
  switch(action.type) {
    case SELECT_MESSAGE:
      return action.payload;
  }
  return state;
}
