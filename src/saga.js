import { all } from 'redux-saga/effects';

import * as firebase from 'firebase';
import config from './firebase.config'
firebase.initializeApp(config);

// References that the application will use
const database = firebase.database();
export const feedRef = database.ref('/feed');
export const auth = firebase.auth();

export const GoogleAuthProvider = () => {
  return new firebase.auth.GoogleAuthProvider();
}

export const FacebookAuthProvider = () => {
  return new firebase.auth.FacebookAuthProvider();
}

export const TwitterAuthProvider = () => {
  return new firebase.auth.TwitterAuthProvider();
}

auth.signIn = (provider) => auth.signInWithPopup(provider);

feedRef.sendMessage = (message) => feedRef.push(message);

// Saga-s all around application
import feedSaga from './modules/Feed/feed.saga';
import postSaga from './modules/Post/post.saga';
import authSaga from './modules/Auth/auth.saga';

export default function* root() {
  yield all([
    feedSaga(),
    postSaga(),
    authSaga(),
  ]);
}
