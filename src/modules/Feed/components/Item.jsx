import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import Message from './Message';
import LikeButton from './LikeButton'

const Item = (props) => (
  <div className="item event">
    <Avatar src={props.user.avatar} />
    <div className="content">
      <div className="summary">
        <a>{props.user.email}</a> posted this message
        <div className="date">
          {props.created}
        </div>
      </div>
      <Message text={props.text} />
      <div className="meta">
        <LikeButton
          onClick={() => props.onLike(props.id)}
          disabled={props.userLiked}
          likesCnt={props.likesCnt}
        />
      </div>
    </div>
  </div>
);

Item.propTypes = {
  created: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onLike: PropTypes.func.isRequired,
  userLiked: PropTypes.bool.isRequired,
  likesCnt: PropTypes.number.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    avatar: PropTypes.string.isRequired,
  }),
}

export default Item;
