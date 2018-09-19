import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {search} from '../actions/index';
import MessageToScroll from './message_to_scroll';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {term: ""};
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({term: event.target.value});
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.search(this.state.term);
  }

  renderSearchResults(searchResult, index) {
    return (
      <div key={index}>
        <MessageToScroll data={searchResult} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit} className="form">
          <div className="form-group">
            <input
              placeholder="Search..."
              className="form-control"
              value={this.state.term}
              onChange={this.onInputChange}
            />
          </div>
          <div className="input-group-btn">
            <button type="submit" className="btn btn-secondary">Search</button>
          </div>
        </form>
        <div>
          {this.props.searchResults.map(this.renderSearchResults)}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({search}, dispatch);
}

function mapStateToProps({searchResults}) {
  return {searchResults};
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
