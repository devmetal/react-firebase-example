import React, { Component } from 'react';
import { connect } from 'react-redux';
import { itemsMapLikes } from './feed.selector';
import { Feed } from './components';

import { FEED_ITEM_LIKE_REQUEST } from './feed.saga'; 

class FeedContainer extends Component {
  onLikeHandler = (id) => {
    this.props.dispatch({
      type: FEED_ITEM_LIKE_REQUEST,
      payload: { itemId: id },
    });
  }

  render() {
    const { items } = this.props;
    return <Feed onLike={this.onLikeHandler} items={items} />
  }
}

const mapStateToProps = state => ({
  items: itemsMapLikes(state),
});

export default connect(mapStateToProps)(FeedContainer);
