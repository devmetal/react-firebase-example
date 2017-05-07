import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import Message from './Message';

const Item = (props) => (
  <div className="item">
    <div className="item-head">
      <Avatar src={props.user.avatar} />
      <span>{props.user.email}</span>
    </div>
    <Message text={props.text} />
    <div className="item-footer">
      <button
        className="hot"
        onClick={() => props.onHot(props.id)}>
        Hot!
      </button>
      <span>Created At: {props.created}</span>
    </div>
  </div>
);

Item.propTypes = {
  created: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onHot: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }),
}

export default Item;
