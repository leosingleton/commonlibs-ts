// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { AsyncManualResetEvent } from '../../coordination';

describe('TaskScheduler', () => {

  it('Executes in a WebWorker', async () => {
    // WebWorker code is located in /src/__tests__/WebWorker.ts
    let worker = new Worker('base/test-worker.js');
    
    let result: number;
    let done = new AsyncManualResetEvent();
    worker.onmessage = e => {
      result = e.data;
      done.set();
    };

    // Invoke the 'TaskScheduler' event. This is a copy of the "Execute tasks in priority order" unit test, which
    // expects a value of 202.
    worker.postMessage('TaskScheduler');
    await done.waitAsync();
    expect(result).toEqual(202);
  });

});
