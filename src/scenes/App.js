import React, { Component } from 'react';
import Feed from '../modules/Feed';
import Post from '../modules/Post';

class AppScene extends Component {
  render() {
    return (
      <div className="App">
        <div className="ui two column centered grid">
          <div className="two column row">
            <div className="column">
              <Post />
            </div>
          </div>
          <div className="two column row">
            <div className="column">
              <Feed />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppScene;
