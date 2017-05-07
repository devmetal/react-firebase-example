import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Feed } from './components';

class FeedContainer extends Component {
  render() {
    const { items } = this.props;
    return <Feed items={items} />
  }
}

const mapStateToProps = state => ({
  items: state.feed.items,
});

export default connect(mapStateToProps)(FeedContainer);
