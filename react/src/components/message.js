import React from 'react';

function formatDate(date) {
  var dateObj = new Date(parseInt(date));
  var stringSplit = dateObj.toString().split(':');
  return stringSplit[0] + ':' + stringSplit[1];
}

function renderTextWithNewLine(text) {
  var lines = text.split('\n');
  return lines.map((line, index) => (<span key={index}>{line}<br/></span>));
}

function renderContent(data) {
  if (data.media == "img") {
    return (
      <div>
        <img src={data.content} />
      </div>
    );
  } else {
    return (
      <span>{renderTextWithNewLine(data.content)}</span>
    );
  }
}

function getId(showId, id) {
  if (showId) {
    return id;
  } else {
    return null;
  }
}

export default (props) => {
  return (
    <div
      id={getId(props.showId, props.data._id)}
      className={`message ${props.data.messageType}`}
      onDoubleClick={props.onDoubleClick}
      >
      <div className="text">
        {renderContent(props.data)}
      </div>
      <div className="timestamp">
        <span>{formatDate(props.data.date)}</span>
      </div>
    </div>
  )
}
