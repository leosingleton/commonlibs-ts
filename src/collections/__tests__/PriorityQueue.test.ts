// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { PriorityQueue } from '../PriorityQueue';

describe('PriorityQueue', () => {

  it('Ensures the PriorityQueue returns messages in priority order', () => {
    let queue = new PriorityQueue<number>();
    queue.enqueue(1, 4);
    queue.enqueue(2, 2); // 2 is higher-priority than 4

    // 2 should be returned first, as it is higher priority
    let result1 = queue.dequeue();
    expect(result1).toEqual(2);

    // 1 should be returned next
    let result2 = queue.dequeue();
    expect(result2).toEqual(1);

    // undefined should be returned, as there are no more messages
    let result3 = queue.dequeue();
    expect(result3).toBeUndefined();
  });

  it('Detects the number of elements in the queue', () => {
    let queue = new PriorityQueue<number>();
    expect(queue.getCount()).toEqual(0);
    expect(queue.isEmpty()).toBeTruthy();

    // Add a value
    queue.enqueue(1, 1);
    expect(queue.getCount()).toEqual(1);
    expect(queue.isEmpty()).toBeFalsy();

    // Remove a value
    queue.dequeue();
    expect(queue.getCount()).toEqual(0);
    expect(queue.isEmpty()).toBeTruthy();
  });
});
