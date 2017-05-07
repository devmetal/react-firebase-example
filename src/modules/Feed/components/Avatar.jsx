import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ src }) =>
  <img className="avatar" src={src} alt="Avatar" />;

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Avatar;
