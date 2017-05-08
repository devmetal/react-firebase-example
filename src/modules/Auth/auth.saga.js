import { eventChannel } from 'redux-saga';
import { call, take, takeEvery, put, all } from 'redux-saga/effects';
import {
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from '../../saga';

export const USER_SIGN_IN = 'USER_SIGN_IN';
export const USER_SIGN_OUT = 'USER_SIGN_OUT';
export const AUTH_REQUEST = 'AUTH_REQUEST';

export function authStateChangedChannel() {
  return eventChannel((emitter) => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        const mapped = { email: user.email, avatar: user.photoURL || '' };
        emitter({ user: mapped });
      } else {
        emitter({ user: null });
      }
    });
  })
};

export function* authStateChanged() {
  try {
    const chan = yield call(authStateChangedChannel);
    while (true) {
      const { user } = yield take(chan);
      if (user) {
        yield put({ type: USER_SIGN_IN, payload: user });
      } else {
        yield put({ type: USER_SIGN_OUT });
      }
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

function* watchAuthRequest() {
  while (true) {
    const { provider } = yield take(AUTH_REQUEST);
    switch (provider) {
      case 'google':
        yield call(authGoogle);
        break;
      case 'twitter':
        yield call(authTwitter);
        break;
      case 'facebook':
        yield call(authFacebook);
        break;
      default:
        break;
    }
  }
}

function* userSignedIn() {
  yield takeEvery(USER_SIGN_IN, ({ payload }) => {
    localStorage.setItem('signed', 'true');
    localStorage.setItem('user', JSON.stringify(payload));
  });
}

export default function* authSaga() {
  yield all([
    call(watchAuthRequest),
    call(authStateChanged),
    call(userSignedIn),
  ]);
}
