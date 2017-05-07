import { all } from 'redux-saga/effects';

import * as firebase from 'firebase';
import config from './firebase.config'
firebase.initializeApp(config);

// References that the application will use
const database = firebase.database();
export const feedRef = database.ref('/feed');

// Saga-s all around application
import feedSaga from './modules/Feed/feed.saga';

export default function* root() {
  yield all([
    feedSaga(feedRef)
  ]);
}