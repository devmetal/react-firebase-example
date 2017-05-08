import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
} from 'react-router-dom'

import App from './scenes/App';
import Auth from './scenes/Auth';

import store from './store';

const isAuthenticated = () => store.getState().auth.signed;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated() ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/auth',
          state: { from: props.location }
        }} />
      )
  )} />
)

const Root = () => (
  <Provider store={store}>
    <Router>
      <div>
        <PrivateRoute exact path="/" component={App} />
        <Route path="/auth" component={Auth} />
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
