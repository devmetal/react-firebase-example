import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Auth } from './components';

import {
  AUTH_REQUEST_GL,
} from './auth.saga';

class AuthContainer extends Component {  
  handleAuthGoogle = () => {
    this.props.dispatch({
      type: AUTH_REQUEST_GL,
    });
  }
  
  render() {
    return (
      <Auth
        onAuthGoogle={this.handleAuthGoogle}
      />
    );
  }
}

export default connect()(AuthContainer);
