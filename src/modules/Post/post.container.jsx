import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Post } from './components';
import { MESSAGE_REQUEST } from './post.saga';

class PostContainer extends Component {
  handleSend = (text) => {
    // Demo payload before auth
    const created = moment().toISOString();
    const user = {
      email: 'test@domain.com',
      avatar: 'http://bit.ly/2pjf8sP',
    }
    const payload = { user, text, created };
    this.props.dispatch({ type: MESSAGE_REQUEST, payload });
  }

  render() {
    return <Post onSend={this.handleSend} />;
  }
}

const mapStateToProps = state => ({
  sent: state.post.sent,
});

export default connect(mapStateToProps)(PostContainer);
