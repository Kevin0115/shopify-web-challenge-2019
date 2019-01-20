import React, { Component } from 'react';
import '../css/SearchBar.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faSearch } from '@fortawesome/free-solid-svg-icons';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {value: ''};
  }

  handleChange(textEvent) {
    this.setState({value: textEvent.target.value});
  }

  handleSubmit(e) {
    alert('Submitted: ' + this.state.value);
    e.preventDefault();
  }
  render() {
    return (
      <div className="searchbar">
        <form className="seachform" onSubmit={this.handleSubmit}>
          <input className="text-input" type="text" value={this.state.value} onChange={this.handleChange} />
          <button className="search-button" type="image">
            Search
          </button>
        </form>
      </div>
    );
  }
}

export default SearchBar;
