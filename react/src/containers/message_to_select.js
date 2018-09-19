import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {selectMessage} from '../actions/index';
import Message from '../components/message';

class MessageToSelect extends Component {
  constructor(props) {
    super(props);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onDoubleClick(event) {
    this.props.selectMessage(this.props.data);
  }

  render() {
    return (
      <Message onDoubleClick={this.onDoubleClick} data={this.props.data} showId={this.props.showId}/>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({selectMessage}, dispatch);
}

export default connect(null, mapDispatchToProps)(MessageToSelect);
