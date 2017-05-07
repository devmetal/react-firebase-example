import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Auth extends Component {
  static propTypes ={
    onAuthFacebook: PropTypes.func.isRequired,
    onAuthGoogle: PropTypes.func.isRequired,
    onAuthTwitter: PropTypes.func.isRequired,
    onAuthEmailPass: PropTypes.func.isRequired,
  };

  render() {
    const {
      onAuthFacebook,
      onAuthGoogle,
      onAuthTwitter
    } = this.props;

    return ( 
      <div className="auth">
        <h1>Sign in</h1>
        <button className="facebook" onClick={onAuthFacebook}>Facebook</button>
        <button className="google" onClick={onAuthGoogle}>Google</button>
        <button className="twitter" onClick={onAuthTwitter}>Twitter</button>
      </div>
    );
  }
}

export default Auth;
