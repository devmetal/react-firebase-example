import { combineReducers } from 'redux';

// Reducers all around application
import feed from './modules/Feed/feed.reducer';

export default combineReducers({ feed });
