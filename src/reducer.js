import { combineReducers } from 'redux';

// Reducers all around application
import feed from './modules/Feed/feed.reducer';
import post from './modules/Post/post.reducer';
import auth from './modules/Auth/auth.reducer';

export default combineReducers({ feed, post, auth });
