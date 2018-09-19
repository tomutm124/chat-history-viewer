import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MessageToScroll from './message_to_scroll';
import {deleteTag} from '../actions/index';

class MessageInTag extends Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(event) {
    this.props.deleteTag(this.props.tagName, this.props.data);
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-9">
          <MessageToScroll data={this.props.data} />
        </div>
        <div className="col-lg-3 tagDeleteButton">
          <button onClick={this.onButtonClick}>Delete</button>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({deleteTag}, dispatch);
}

export default connect(null, mapDispatchToProps)(MessageInTag);
