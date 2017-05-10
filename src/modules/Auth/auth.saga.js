import { eventChannel } from 'redux-saga';
import { call, take, put, all } from 'redux-saga/effects';
import {
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from '../../saga';

export const USER_SIGN_IN = 'USER_SIGN_IN';
export const USER_SIGN_OUT = 'USER_SIGN_OUT';
export const AUTH_REQUEST_FB = 'AUTH_REQUEST_FB';
export const AUTH_REQUEST_GL = 'AUTH_REQUEST_GL';
export const AUTH_REQUEST_TWT = 'AUTH_REQUEST_TWT';
export const SIGN_OUT_REQUEST = 'SIGN_OUT_REQUEST';

export const authStateChangedChannel = () =>
  eventChannel(emitter => auth.onAuthStateChanged((user) => {
    if (user) {
      const payload = { id: user.uid, email: user.email, avatar: user.photoURL || '' };
      emitter({ type: USER_SIGN_IN, payload });
    } else {
      emitter({ type: USER_SIGN_OUT });
    }
  }));

export function* authStateChanged() {
  try {
    const chan = yield call(authStateChangedChannel);
    while (true) {
      const action = yield take(chan);
      yield put(action);
    }
  } finally {
    console.log('auth state change terminated');
  }
}

export function* authFacebook() {
  const provider = FacebookAuthProvider();
  yield call(auth.signIn, provider);
}

export function* authGoogle() {
  const provider = GoogleAuthProvider();
  yield call(auth.signIn, provider);
}

export function* authTwitter() {
  const provider = TwitterAuthProvider();
  yield call(auth.signIn, provider);
}

export function* signOut() {
  yield call([auth, auth.signOut]);
}

function* watchTwitterAuthRequest() {
  while(true) {
    yield take(AUTH_REQUEST_TWT);
    yield call(authTwitter);
  }
}

function* watchGoogleAuthRequest() {
  while(true) {
    yield take(AUTH_REQUEST_GL);
    yield call(authGoogle);
  }
}

function* watchFacebookAuthRequest() {
  while(true) {
    yield take(AUTH_REQUEST_FB);
    yield call(authFacebook);
  }
}

function* watchSignOut() {
  while(true) {
    yield take(SIGN_OUT_REQUEST);
    yield call(signOut);
  }
}

export default function* authSaga() {
  yield all([
    call(watchTwitterAuthRequest),
    call(watchGoogleAuthRequest),
    call(watchFacebookAuthRequest),
    call(watchSignOut),
    call(authStateChanged),
  ]);
}
