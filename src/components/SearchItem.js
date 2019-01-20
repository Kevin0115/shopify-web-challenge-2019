import React, { Component } from 'react';
import '../css/SearchItem.css';

import decode from 'unescape';


export default class SearchItem extends Component {
  render() {
    return (
      <div className="search-item">
        <div className="title">
          <button type="button">A</button>
          <p>{this.props['title']}</p>
          {/* <p>{this.props['isFav'].toString()}</p> */}
        </div>
        <div className="desc" dangerouslySetInnerHTML={{__html: decode(this.props['body'])}}/>
      </div>
    );
  }
}