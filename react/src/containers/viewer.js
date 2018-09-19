import React, {Component} from 'react';
import {connect} from 'react-redux';
import MessageToSelect from './message_to_select';
import InfiniteScroll from 'react-infinite-scroller';
import {bindActionCreators} from 'redux';
import {loadMessages} from '../actions/index';
import _ from 'lodash';

const loadingRate = 30;

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.loadItems = this.loadItems.bind(this);
  }

  renderMessage(message) {
    return (
      <MessageToSelect data={message} key={message._id} showId={true}/>
    )
  }

  loadItems(page) {
    var currentMessages = this.props.messages;
    if (currentMessages.length == 0) {
      this.props.loadMessages(loadingRate);
    } else {
      this.props.loadMessages(loadingRate, currentMessages[0].date);
    }
    var scrollerContainer = document.getElementById("scrollerContainer");
    scrollerContainer.scrollTop = 5;
  }

  render() {
    const loadItems = _.debounce(page => {this.loadItems(page)}, 500);
    return (
      <div className="viewer col-lg-8">
        <div id="scrollerContainer" className="infinite_scroll">
          <InfiniteScroll
              threshold={1}
              pageStart={0}
              loadMore={loadItems}
              hasMore={true}
              loader={<div key={0}></div>}
              useWindow={false}
              isReverse={true}
          >
            {this.props.messages.map(this.renderMessage)}
          </InfiniteScroll>
        </div>

      </div>
    );
  }
}

function mapStateToProps({messages}) {
  return {messages};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadMessages}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
