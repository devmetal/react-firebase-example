import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
  };

  state = { value: '', error: false, done: false };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
      error: false,
      done: false,
    });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { onSend } = this.props;
    if (!value.length) {
      return this.error();
    }
    this.done();
    onSend(value);
  }

  error = () => this.setState({error: true});
  done = () => this.setState({done: true, value: ''});

  render() {
    const { value, error, done } = this.state;
    return (
      <div className="post">
        <textarea value={value} onChange={this.handleChange}></textarea>
        <button onClick={this.handleSubmit}>Fire Up</button>
        {error && <span className='error'>You have to write something!</span>}
        {done && <span className='done'>Your message sent!</span>}
      </div>
    );
  }
}
