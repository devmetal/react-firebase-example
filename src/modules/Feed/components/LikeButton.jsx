import React from 'react';
import PropTypes from 'prop-types';

const LikeButton = (props) => {
  let classes = 'ui red mini button';

  if (props.disabled) {
    classes += ' disabled';
  }

  return (
    <div className="ui labeled button">
      <div onClick={props.onClick} className={`${classes}`}>
        <i className="heart icon"></i> Like
      </div>
      <a className="ui basic red left pointing label">
        {props.likesCnt}
      </a>
    </div>
  )
}

LikeButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  likesCnt: PropTypes.number.isRequired,
};

export default LikeButton;
