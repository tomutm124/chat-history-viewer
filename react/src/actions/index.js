import axios from 'axios';

const ROOT_URL = "http://localhost:8000/"

export const LOAD_MESSAGES = 'LOAD_MESSAGES';

export function loadMessages(number, date=null) {
  var url = `${ROOT_URL}messages?number=${number}`;
  if (date) {
    url = url + `&date=${date}`
  }
  console.log("loading messages from:", url)
  const request = axios.get(url);
  return {
    type: LOAD_MESSAGES,
    payload: request
  };

}

export const SEARCH = 'SEARCH';

export function search(term) {
  var encodedTerm = encodeURIComponent(term);
  var url = `${ROOT_URL}search?q=${encodedTerm}`;
  const request = axios.get(url);
  return {
    type: SEARCH,
    payload: request
  };
}

export const LOAD_MESSAGES_BY_DATE_RANGE = 'LOAD_MESSAGES_BY_DATE_RANGE';

function loadMessagesByDateRange(date1, date2) {
  var url = `${ROOT_URL}search/messages?date1=${date1}&date2=${date2}`
  const request = axios.get(url);
  return (dispatch) => {
    return request.then((response) => {
      dispatch({type: LOAD_MESSAGES_BY_DATE_RANGE, payload: response});
    });
  };
}

export const SCROLL_TO = 'SCROLL_TO';

export function loadAndScrollTo(targetMessage) {
  return (dispatch, getState) => {
    // check if the message is already loaded
    if (getState().messages.find((m) => {return m._id == targetMessage._id}) != undefined) {
      console.log("create SCROLL_TO without loading");
      return dispatch({type: SCROLL_TO, payload: targetMessage});
    }
    console.log("SCROLL_TO needs to load, targetMessage ID:", targetMessage._id)
    return dispatch(
      loadMessagesByDateRange(targetMessage.date, getState().messages[0].date)
    ).then(() =>
      dispatch({type: SCROLL_TO, payload: targetMessage})
    );
  };
}

export const SELECT_MESSAGE = 'SELECT_MESSAGE';
export function selectMessage(message) {
  return {
    type: SELECT_MESSAGE,
    payload: message
  }
}

export const ADD_TAG = 'ADD_TAG';
export function addTag(tagName, message) {
  var url = `${ROOT_URL}tags/create`;
  const request = axios.post(url, {
    tagName: tagName,
    messageId: message._id
  });
  return {
    type: ADD_TAG,
    payload: request
  };
}

export const LOAD_TAG = 'LOAD_TAG';
export function loadTag() {
  var url = `${ROOT_URL}tags`;
  const request = axios.get(url);
  return {
    type: LOAD_TAG,
    payload: request
  };
}

export const DELETE_TAG = 'DELETE_TAG';
export function deleteTag(tagName, message) {
  var url = `${ROOT_URL}tags/delete`;
  const request = axios.post(url, {
    tagName: tagName,
    messageId: message._id
  });
  return {
    type: DELETE_TAG,
    payload: request,
    meta: {
      tagName: tagName
    }
  };
}
