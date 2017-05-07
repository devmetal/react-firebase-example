import { put, take, call, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

export const FEED_CHILD_ADDED = 'FEED_CHILD_ADDED';
export const FEED_CHILD_CHANGED = 'FEED_CHILD_CHANGED';
export const FEED_CHILD_REMOVED = 'FEED_CHILD_REMOVED';

export function feedChildAddedChannel(ref) {
  return eventChannel((emitter) => {
    ref.on('child_added', (data) => {
      const id = data.key;
      const value = data.val();
      emitter({ ...value, id });
    })
    return () => ref.off();
  });
};

export function feedChildChangedChannel(ref) {
  return eventChannel((emitter) => {
    ref.on('child_changed', (data) => {
      const id = data.key;
      const value = data.val();
      emitter({ ...value, id });
    });
    return () => ref.off();
  });
};

export function feedChildRemovedChannel(ref) {
  return eventChannel((emitter) => {
    ref.on('child_removed', (data) => {
      const { key } = data;
      emitter({ id: key });
    });
    return () => ref.off();
  });
};

export function* feedChildAdded(ref) {
  try {
    const chan = yield call(feedChildAddedChannel, ref);
    while (true) {
      let feedItem = yield take(chan);
      yield put({ type: FEED_CHILD_ADDED, payload: feedItem });
    }
  } finally {
    console.log('child_added terminated');
  }
}

export function* feedChildChanged(ref) {
  try {
    const chan = yield call(feedChildChangedChannel, ref);
    while (true) {
      const feedItem = yield take(chan);
      yield put({ type: FEED_CHILD_CHANGED, payload: feedItem });
    }
  } finally {
    console.log('child_changed terminated');
  }
}

export function* feedChildRemoved(ref) {
  try {
    const chan = yield call(feedChildRemovedChannel, ref);
    while (true) {
      const feedItem = yield take(chan);
      yield put({ type: FEED_CHILD_REMOVED, payload: feedItem });
    }
  } finally {
    console.log('child_removed terminated');
  }
}

export default function *feed(ref) {
  yield all([
    call(feedChildAdded, ref),
    call(feedChildChanged, ref),
    call(feedChildRemoved, ref),
  ]);
}
