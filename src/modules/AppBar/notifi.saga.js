import { put, take, takeEvery, call, all, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { notiRef, messaging, api } from '../../saga';

import { USER_SIGN_IN } from '../Auth/auth.saga';

export const NOTIFICATION_ADDED = 'NOTIFICATION_ADDED';
export const NOTIFICATION_REMOVED = 'NOTIFICATION_REMOVED';
export const NOTIFICATION_READED = 'NOTIFICATION_READED';
export const FCM_TOKEN_SENT = 'FCM_TOKEN_SENT';

export const notificationsAddedChannel = (userId) => eventChannel((emitter) => {
  const ref = notiRef.child(userId);
  ref.on('child_added', (data) => {
    const id = data.key;
    const value = data.val();
    emitter({ ...value, id });
  });
  return () => ref.off();
});

export const notificationsRemovedChannel = (userId) => eventChannel((emitter) => {
  const ref = notiRef.child(userId);
  ref.on('child_removed', (data) => {
    const { key } = data;
    emitter({ id: key });
  });
  return () => ref.off();
})

export const fcmTokenRefreshChannel = () => eventChannel((emitter) => {
  messaging.onTokenRefresh(() => {
    messaging.getToken().then((token) => {
      emitter({ token });
    });
  })
  // Unsubscribe
  return () => { };
});

export function* requestFcmToken() {
  yield take(USER_SIGN_IN);
  try {
    yield call([messaging, messaging.requestPermission]);
    const token = yield call([messaging, messaging.getToken]);
    const user = yield select(state => state.auth.user);
    yield call(api.fcm, token, user.id);
    yield put({ type: FCM_TOKEN_SENT });
  } catch (e) {
    console.log(e);
  }
}

export function* fcmTokenRefresh() {
  const chan = yield call(fcmTokenRefreshChannel);
  while (true) {
    const { token } = yield take(chan);
    const user = yield select(state => state.auth.user);
    yield call(api.fcm, token, user.id);
    yield put({ type: FCM_TOKEN_SENT });
  }
}

export function* notificationAdded() {
  yield take(USER_SIGN_IN);
  const user = yield select(state => state.auth.user);
  try {
    const chan = yield call(notificationsAddedChannel, user.id);
    while (true) {
      const payload = yield take(chan);
      yield put({ type: NOTIFICATION_ADDED, payload });
    }
  } finally {
    console.log('notifications channel terminated')
  }
};

export function* notificationRemoved() {
  yield take(USER_SIGN_IN);
  const user = yield select(state => state.auth.user);
  try {
    const chan = yield call(notificationsRemovedChannel, user.id);
    while (true) {
      const payload = yield take(chan);
      yield put({ type: NOTIFICATION_REMOVED, payload });
    }
  } finally {
    console.log('notifications channel terminated')
  }
}

function* watchUserReadNotifications() {
  yield takeEvery(NOTIFICATION_READED, deleteNotification);
}

function* deleteNotification(action) {
  const id = action.payload;
  const user = yield select(state => state.auth.user);
  yield call(notiRef.removeNoti, user.id, id);
}

export default function* notifications() {
  yield all([
    call(notificationAdded),
    call(notificationRemoved),
    call(watchUserReadNotifications),
    call(fcmTokenRefresh),
    call(requestFcmToken),
  ])
}
