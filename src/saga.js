import { all } from 'redux-saga/effects';
import axios from 'axios';

import * as firebase from 'firebase';
import config from './firebase.config'

// Saga-s all around application
import feedSaga from './modules/Feed/feed.saga';
import postSaga from './modules/Post/post.saga';
import authSaga from './modules/Auth/auth.saga';
import notifSaga from './modules/AppBar/notifi.saga';

firebase.initializeApp(config);

// References that the application will use
const database = firebase.database();
export const feedRef = database.ref('/feed');
export const notiRef = database.ref('/notif');
export const likesRef = database.ref('/likes');
export const auth = firebase.auth();
export const messaging = firebase.messaging();

messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
  // ...
});

export const GoogleAuthProvider = () => {
  return new firebase.auth.GoogleAuthProvider();
}

export const FacebookAuthProvider = () => {
  return new firebase.auth.FacebookAuthProvider();
}

export const TwitterAuthProvider = () => {
  return new firebase.auth.TwitterAuthProvider();
}

export const getUserLikes = user =>
  likesRef.child(user.id).once('value');

const api = {
  like(itemId, userId) {
    return axios.put('/api/like', { itemId, userId })
  },
  fcm(token, userId) {
    return axios.put('/api/fcmToken', { token, userId })
  }
}

export { api };

auth.signIn = (provider) => auth.signInWithPopup(provider);

feedRef.sendMessage = (message) => feedRef.push(message);

feedRef.likeItem = (id, userId) => feedRef.child(id).child('likes').push(userId);

notiRef.notifyUser = (userId, noti) => notiRef.child(userId).push(noti);

notiRef.removeNoti = (userId, notiId) => notiRef.child(userId).child(notiId).remove();

export default function* root() {
  yield all([
    feedSaga(),
    postSaga(),
    authSaga(),
    notifSaga(),
  ]);
}
