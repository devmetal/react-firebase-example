import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Auth } from './components';

import { AUTH_REQUEST } from './auth.saga';

class AuthContainer extends Component {
  handleAuthFacebook = () => {
    this.props.dispatch({
      type: AUTH_REQUEST,
      provider: 'facebook',
    });
  }

  handleAuthGoogle = () => {
    this.props.dispatch({
      type: AUTH_REQUEST,
      provider: 'google',
    });
  }

  handleAuthTwitter = () => {
    this.props.dispatch({
      type: AUTH_REQUEST,
      provider: 'twitter',
    });
  }
  
  render() {
    return (
      <Auth
        onAuthFacebook={this.handleAuthFacebook}
        onAuthGoogle={this.handleAuthGoogle}
        onAuthTwitter={this.handleAuthTwitter}
        onAuthEmailPass={() => {}}
      />
    );
  }
}

export default connect()(AuthContainer);
