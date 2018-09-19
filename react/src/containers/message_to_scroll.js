import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadAndScrollTo} from '../actions/index';
import Message from '../components/message';

// click this message to scroll the viewer to show this message
// clicking will first load the message from server if not already loaded
class MessageToScroll extends Component {
  constructor(props) {
    super(props);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onDoubleClick(event) {
    this.props.loadAndScrollTo(this.props.data);
  }

  render() {
    return (
      <Message onDoubleClick={this.onDoubleClick} data={this.props.data} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadAndScrollTo}, dispatch);
}

export default connect(null, mapDispatchToProps)(MessageToScroll);
