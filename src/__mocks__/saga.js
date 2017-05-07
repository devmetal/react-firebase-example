import { EventEmitter } from 'events';

class FakeRef extends EventEmitter {
  childAdded(data) {
    const child = {
      val() {
        return { ...data };
      },
      key: 'itemid',
    };

    this.emit('child_added', child);
  };

  childChanged(data) {
    console.log('I\'m fake');
    const child = {
      val() {
        return { ...data };
      },
      key: 'itemid',
    };

    this.emit('child_changed', child);
  };

  childRemoved(id) {
    const child = {
      key: id
    };

    this.emit('child_removed', child);
  };

  off() {
    this.removeAllListeners();
  };

  push(data) {
    console.log('i\'m fake');
    return new Promise(
      resolve => resolve(data)
    );
  };
}

export const feedRef = new FakeRef();
