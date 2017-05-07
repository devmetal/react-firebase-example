import { all, takeEvery } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga'
import  configureMockStore from 'redux-mock-store';
import moment from 'moment';
import { EventEmitter } from 'events';

import feed, { 
  feedChildAddedChannel,
  feedChildChangedChannel,
  feedChildRemovedChannel, 
  FEED_CHILD_ADDED,
  FEED_CHILD_CHANGED,
  FEED_CHILD_REMOVED,
} from '../feed.saga.js';

class FakeRef extends EventEmitter {
  childAdded(data) {
    const child = {
      val() {
        return { ...data };
      },
      key: 'itemid',
    };

    this.emit('child_added', child);
  }

  childChanged(data) {
    const child = {
      val() {
        return { ...data };
      },
      key: 'itemid',
    };

    this.emit('child_changed', child);
  }

  childRemoved(id) {
    const child = {
      key: id
    };

    this.emit('child_removed', child);
  }

  off() {
    this.removeAllListeners();
  }
}

const fakeRef = new FakeRef();
const fakeTime = moment().toISOString();

const itemFb = {
  user: {
    email: 'test@domain.com',
    avatar: 'avatar src',
  },
  text: 'Something',
  created: fakeTime,
};

const itemExpected = {
  user: {
    email: 'test@domain.com',
    avatar: 'avatar src',
  },
  text: 'Something',
  created: fakeTime,
  id: 'itemid',
};

describe('feed saga', () => {
  describe('child_changed', () => {
    it('feed changed channel working', (done) => {
      const chan = feedChildChangedChannel(fakeRef);
      
      chan.take((item) => {
        expect(item).toEqual(itemExpected);
        done();
      });

      fakeRef.childChanged(itemFb);
      chan.close();
    })
  })

  describe('child_removed', () => {
    it('feed removed channel working', (done) => {
      const chan = feedChildRemovedChannel(fakeRef);

      chan.take((item) => {
        expect(item).toEqual({ id: 'itemid' });
        done();
      })

      fakeRef.childRemoved('itemid');
      chan.close();
    })
  })

  describe('child_added', () => {
    it('feed child added channel working', (done) => {
      const chan = feedChildAddedChannel(fakeRef);

      chan.take((item) => {
        expect(item).toEqual(itemExpected);
        done();
      });

      fakeRef.childAdded(itemFb);
      chan.close();
    });
  });

  describe('main saga', () => {
    const addedSpy = jest.fn();
    const changedSpy = jest.fn();
    const removedSpy = jest.fn();

    const testWorker = function* testWorker() {
      yield takeEvery(FEED_CHILD_ADDED, addedSpy);
      yield takeEvery(FEED_CHILD_CHANGED, changedSpy);
      yield takeEvery(FEED_CHILD_REMOVED, removedSpy);
    }

    const testRoot = function *testRoot() {
      yield all([
        testWorker(),
        feed(fakeRef),
      ]);
    }

    const sagaMiddleware = createSagaMiddleware();
    const mockStore = configureMockStore([sagaMiddleware]);
    mockStore({});

    sagaMiddleware.run(testRoot);

    fakeRef.childAdded(itemFb);
    fakeRef.childChanged(itemFb);
    fakeRef.childRemoved('itemid');

    expect(addedSpy).toBeCalledWith({
      type: FEED_CHILD_ADDED,
      payload: itemExpected,
    });
    
    expect(changedSpy).toBeCalledWith({
      type: FEED_CHILD_CHANGED,
      payload: itemExpected,
    });
    
    expect(removedSpy).toBeCalledWith({
      type: FEED_CHILD_REMOVED,
      payload: { id: 'itemid' },
    });
  });
});
