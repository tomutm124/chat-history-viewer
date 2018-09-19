import React, {Component} from 'react';
import LoadBar from '../containers/load_bar';
import SearchBox from '../containers/search_box';
import MessageDetails from '../containers/message_details';
import TagViewer from '../containers/tag_viewer';

export default class ControlPanel extends Component {
  render() {
    return (
      <div className="control_panel col-lg-4">
        <LoadBar />
        <hr/>
        <SearchBox />
        <hr/>
        <MessageDetails />
        <hr/>
        <TagViewer />
      </div>
    )
  }
}
