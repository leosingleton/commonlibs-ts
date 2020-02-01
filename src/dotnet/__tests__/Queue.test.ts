// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Queue } from '../Queue';

describe('Queue', () => {

  it('Enqueues and dequeues values', () => {
    const q = new Queue<number>();

    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);

    expect(q.getCount()).toEqual(3);
    expect(q.isEmpty()).toBeFalsy();
    expect(q.toValueArray()).toEqual([1, 2, 3]);

    expect(q.tryPeek()).toEqual(1);
    expect(q.dequeue()).toEqual(1);
    expect(q.tryPeek()).toEqual(2);
    expect(q.dequeue()).toEqual(2);
    expect(q.tryPeek()).toEqual(3);
    expect(q.dequeue()).toEqual(3);
    expect(q.tryPeek()).toBeUndefined();
    expect(q.dequeue()).toBeUndefined();

    expect(q.getCount()).toEqual(0);
    expect(q.isEmpty()).toBeTruthy();
  });

});
