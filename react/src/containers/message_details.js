import React, {Component} from 'react';
import {connect} from 'react-redux';
import Message from '../components/message';
import {addTag} from '../actions/index';
import {bindActionCreators} from 'redux';

class MessageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {tagName: '', showSuccessMessage: false};
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({tagName: event.target.value, showSuccessMessage: false});
  }

  onFormSubmit(event) {
    event.preventDefault();
    // create an add tag event
    this.props.addTag(this.state.tagName, this.props.selectedMessage);
    this.setState({tagName: '', showSuccessMessage: true});
  }

  render() {
    if (!this.props.selectedMessage) {
      return null;
    }
    return (
      <div>
        <Message data={this.props.selectedMessage} />
        {
          this.state.showSuccessMessage && <div><b>Tag added.</b></div>
        }
        <form onSubmit={this.onFormSubmit} className="form">
          <div className="form-group">
            <label htmlFor="addTag">Add a tag:</label>
            <input
              id="addTag"
              className="form-control"
              value={this.state.tagName}
              onChange={this.onInputChange}
            />
          </div>
          <div className="input-group-btn">
            <button type="submit" className="btn btn-secondary">Add Tag</button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps({selectedMessage}) {
  return {selectedMessage};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addTag}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetails);
