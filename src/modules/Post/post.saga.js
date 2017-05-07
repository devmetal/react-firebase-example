import { call, put, takeLatest } from 'redux-saga/effects';
import { feedRef } from '../../saga';

export const MESSAGE_REQUEST = 'MESSAGE_REQUEST';
export const MESSAGE_SENT = 'MESSAGE_SENT';

function* watchMessageRequest() {
}

export function* postMessage(action) {
  yield call(feedRef.push, action.payload);
  yield put({ type: MESSAGE_SENT,  payload: action.payload});
}
