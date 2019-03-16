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
    let result1 = queue.getNext();
    expect(result1).toEqual(2);

    // 1 should be returned next
    let result2 = queue.getNext();
    expect(result2).toEqual(1);

    // null should be returned, as there are no more messages
    let result3 = queue.getNext();
    expect(result3).toBeNull();
  });

});
