import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadTag} from '../actions/index';
import MessageInTag from './message_in_tag';

class TagViewer extends Component {
  constructor(props) {
    super(props);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderTag = this.renderTag.bind(this);
  }

  componentDidMount() {
    this.props.loadTag()
  }

  renderMessage(tagName, message) {
    return (
      <MessageInTag
        key={message._id}
        data={message}
        tagName={tagName}
      />
    );
  }

  renderTag(tag) {
    var renderMessageWithCurrentTagName = (message) => {
      return this.renderMessage(tag.tagName, message);
    }
    return (
      <div key={tag._id}>
        <div><b>{tag.tagName}</b></div>
        {tag.messages.slice().sort((m1, m2) => m1.date - m2.date).map(renderMessageWithCurrentTagName)}
      </div>
    );
  }

  render() {
    if (!this.props.tags) {
      return (<div>No tags yet</div>);
    }
    return (
      <div>
        <h5>Tags</h5>
        {this.props.tags.slice().sort((m1, m2) => {
          if (m1 < m2) {
            return -1;
          } else if (m1 > m2) {
            return 1;
          } 
          return 0;
        }).map(this.renderTag)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadTag}, dispatch);
}

function mapStateToProps({tags}) {
  return {tags};
}

export default connect(mapStateToProps, mapDispatchToProps)(TagViewer);
