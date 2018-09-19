import { combineReducers } from 'redux';
import MessagesReducer from './reducer_messages';
import SearchResultsReducer from './reducer_search_results';
import CurrentMessageReducer from './reducer_current_message';
import SelectedMessageReducer from './reducer_selected_message';
import TagsReducer from './reducer_tags';

const rootReducer = combineReducers({
  messages: MessagesReducer,
  searchResults: SearchResultsReducer,
  currentMessage: CurrentMessageReducer,
  selectedMessage: SelectedMessageReducer,
  tags: TagsReducer
});

export default rootReducer;
