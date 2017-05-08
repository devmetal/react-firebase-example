import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';
import saga from './saga';

const signed = localStorage.getItem('signed') === 'true';
const user = localStorage.getItem('user');
const defaultState = {};

if (signed) {
  defaultState['auth'] = {
    signed,
    user: JSON.parse(user),
  };
}

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  defaultState,
  composeEnhancers(applyMiddleware(...middlewares))
);

sagaMiddleware.run(saga);

export default store;
