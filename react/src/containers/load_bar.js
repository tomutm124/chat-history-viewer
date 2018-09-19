import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadMessages} from '../actions/index';

class LoadBar extends Component {
  constructor(props) {
    super(props);
    this.state = {number: "50"};
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({number: event.target.value});
  }

  onFormSubmit(event) {
    event.preventDefault();
    var currentMessages = this.props.messages;
    if (currentMessages.length == 0) {
      this.props.loadMessages(parseInt(this.state.number));
    } else {
      this.props.loadMessages(parseInt(this.state.number), currentMessages[0].date);
    }
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit} className="form">
        <div className="form-group">
          <label htmlFor="loadMessageInput">Number to Load</label>
          <input
            id="loadMessageInput"
            className="form-control"
            value={this.state.number}
            onChange={this.onInputChange}
          />
        </div>
        <div className="input-group-btn">
          <button type="submit" className="btn btn-secondary">Load</button>
        </div>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadMessages}, dispatch);
}

function mapStateToProps({messages}) {
  return {messages};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBar);
