import React, { Component } from 'react';
import decode from 'unescape';

import './css/Body.css';
import './css/SearchBar.css';
import './css/SearchItem.css';

import GreyStar from './images/greystar.png';
import GreenStar from './images/greenstar.png';
import MagIcon from './images/magnifying-glass.png';

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wasteJSON: {},  // One HTTP request is made to store all waste data - since we don't have a server/API
      favExists: false,
      searchVal: '',
      lastSearch: '',
      searchJSON: [], // JSON that matches search query stored here
      favJSON: [],  // ALl favorites stored here
      searchSubmitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addToFav = this.addToFav.bind(this);
  }

  async componentWillMount() {
    // Initial HTTP request to retrieve waste data
    fetch('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000', {
      method: 'GET',
    }).then((res) => res.json())
    .then((response) => {
      if (response.error) {
        console.warn('Error!', response.error);
      } else {
        this.setState({wasteJSON: response});
      }
    })
    .catch((error) => {
      console.warn('Error: ', error);
    });
  }

  handleChange(textEvent) {
    // We will consider any change to input field a "clear" action, therefore clear results
    if (this.state.searchSubmitted) {
      this.setState({
        searchJSON: [],
        searchSubmitted: false,
        lastSearch: '',
      });
    }
    this.setState({searchVal: textEvent.target.value});
  }

  handleSubmit(e) {
    // Prevent duplicate searches
    if (this.state.lastSearch !== this.state.searchVal) {
      this.setState({searchSubmitted: true, lastSearch: this.state.searchVal});
      this.queryJSON(this.state.searchVal);
    }
    e.preventDefault();
  }

  // Responsible for re-populating the searchJSON array with search results
  queryJSON(search) {
    for (let i = 0; i < this.state.wasteJSON.length; i++) {
      if(this.state.wasteJSON[i]['keywords'].includes(search)) {
        this.state.searchJSON.push(this.state.wasteJSON[i]);
      }
    }
  }

  addToFav(item, index) {
    this.state.searchJSON[index].isFav = true;
    this.state.favJSON.push(item);
    this.forceUpdate();
  }

  removeFav(item, index) {
    for (let i = 0; i < this.state.searchJSON.length; i++) {
      if (item === this.state.searchJSON[i]) {
        this.state.searchJSON[i].isFav = false;
        break;
      }
    }
    for (let i = 0; i < this.state.favJSON.length; i++) {
      if (item === this.state.favJSON[i]) {
        this.state.favJSON.splice(i, 1);
        break;
      }
    }
    this.forceUpdate();
  }

  renderSearchResults() {
    return this.state.searchJSON.map((item, index) => {
      return (
        <div className="search-item">
          <div className="title">
            <img
              className="star"
              src={item.isFav ? GreenStar: GreyStar}
              onClick={item.isFav ? (() => this.removeFav(item, index)) : (() => this.addToFav(item, index))}
              alt=""
            />
            <p>{item['title']}</p>
          </div>
          <div className="desc" dangerouslySetInnerHTML={{__html: decode(item['body'])}}/>
        </div>
      )
    });
  }

  renderFavorites() {
    return this.state.favJSON.map((item, index) => {
      return (
        <div className="fav-item">
          <div className="title">
            <img className="star" src={GreenStar} onClick={() => this.removeFav(item, index)} alt=""/>
            <p>{item['title']}</p>
          </div>
          <div className="desc" dangerouslySetInnerHTML={{__html: decode(item['body'])}}/>
        </div>
      )
    });
  }

  render() {
    return (
      <div className="body">
        <div className="searchbar">
          <form className="seachform" onSubmit={this.handleSubmit}>
            <div className="inputs">
              <input className="text-input" type="text" value={this.state.value} onChange={this.handleChange} />
              <input type="image" className="search-button" src={MagIcon} alt=""/>
            </div>
          </form>
        </div>
        {this.state.searchJSON.length > 0 ?
        this.renderSearchResults()
        :
        <p className="no-results">
          No results. Search for a keyword to get started!
        </p>
        }
        {this.state.favJSON.length > 0 ?
        <div className="favorites">
          <p className="fav-title">Favorites</p>
          {this.renderFavorites()}
        </div>
        :
        null
        }
      </div>
    );
  }
}

export default Body;
