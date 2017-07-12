import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Auth.css';

class Auth extends Component {
  static propTypes = {
    onAuthGoogle: PropTypes.func.isRequired,
  };

  render() {
    const {
      onAuthGoogle,
    } = this.props;

    return (
      <div className="ui segment auth">
        <h4 className="ui header">
          <i className="sign in icon"></i>
          <div className="content">
            Sign In!
          </div>
        </h4>
        <button className="ui fluid google button" onClick={onAuthGoogle}>
          <i className="google icon"></i>
          Google
        </button>
      </div>
    );
  }
}

export default Auth;
