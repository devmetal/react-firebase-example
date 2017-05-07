import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';

class Feed extends Component {
  state = {}

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      created: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        email: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      })
    })).isRequired,
  }

  render() {
    const { items } = this.props;
    return (
      <div className="ui segment feed">
        {items.map((item) => (
          <Item onHot={() => {}} key={item.id} {...item} />
        ))}
      </div>
    );
  }
}

export default Feed;
