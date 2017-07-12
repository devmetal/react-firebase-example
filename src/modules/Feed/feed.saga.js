import { put, take, takeLatest, call, all, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { feedRef } from '../../saga';

export const FEED_CHILD_ADDED = 'FEED_CHILD_ADDED';
export const FEED_CHILD_CHANGED = 'FEED_CHILD_CHANGED';
export const FEED_CHILD_REMOVED = 'FEED_CHILD_REMOVED';
export const FEED_ITEM_LIKED = 'FEED_ITEM_LIKED';
export const FEED_ITEM_LIKE_REQUEST = 'FEED_ITEM_LIKE_REQUEST';

export function feedChildAddedChannel() {
  return eventChannel((emitter) => {
    feedRef.on('child_added', (data) => {
      const id = data.key;
      const value = data.val();
      emitter({ ...value, id });
    })
    return () => feedRef.off();
  });
};

export function feedChildChangedChannel() {
  return eventChannel((emitter) => {
    feedRef.on('child_changed', (data) => {
      const id = data.key;
      const value = data.val();
      emitter({ ...value, id });
    });
    return () => feedRef.off();
  });
};

export function feedChildRemovedChannel() {
  return eventChannel((emitter) => {
    feedRef.on('child_removed', (data) => {
      const { key } = data;
      emitter({ id: key });
    });
    return () => feedRef.off();
  });
};

export function* feedChildAdded() {
  try {
    const chan = yield call(feedChildAddedChannel);
    while (true) {
      let feedItem = yield take(chan);
      yield put({ type: FEED_CHILD_ADDED, payload: feedItem });
    }
  } finally {
    console.log('child_added terminated');
  }
}

export function* feedChildChanged() {
  try {
    const chan = yield call(feedChildChangedChannel);
    while (true) {
      const feedItem = yield take(chan);
      yield put({ type: FEED_CHILD_CHANGED, payload: feedItem });
    }
  } finally {
    console.log('child_changed terminated');
  }
}

export function* feedChildRemoved() {
  try {
    const chan = yield call(feedChildRemovedChannel);
    while (true) {
      const feedItem = yield take(chan);
      yield put({ type: FEED_CHILD_REMOVED, payload: feedItem });
    }
  } finally {
    console.log('child_removed terminated');
  }
}

function* watchLikeRequest() {
  yield takeLatest(FEED_ITEM_LIKE_REQUEST, likeFeedItem);
}

function* likeFeedItem(action) {
  const { itemId } = action.payload;
  const userId = yield select(state => state.auth.user.id);
  yield call(feedRef.like, { userId, itemId })
}

export default function* feed() {
  yield all([
    call(feedChildAdded),
    call(feedChildChanged),
    call(feedChildRemoved),
    call(watchLikeRequest),
  ]);
}
