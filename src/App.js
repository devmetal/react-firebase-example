import React, { Component } from 'react';
import Feed from './modules/Feed';
import Post from './modules/Post';

class App extends Component {
  render() {
    return (
        <div className="App">
          <Post />
          <Feed />
        </div>
    );
  }
}

export default App;
