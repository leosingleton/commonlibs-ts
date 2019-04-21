// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { AsyncManualResetEvent } from '../../coordination';

describe('Task', () => {

  it('Executes in a WebWorker', async () => {
    let worker = new Worker('base/test-worker.js');
    
    let result: number;
    let done = new AsyncManualResetEvent();
    worker.onmessage = e => {
      result = e.data;
      done.set();
    };
    worker.postMessage('TaskScheduler');

    await done.waitAsync();
    expect(result).toEqual(202);

    /* TODO
    // Code comes from the common test case to "Execute tasks in priority order"
    let code = `
      onmessage = async e => {
        let n = 100;

        // Enqueue a low priority task
        TaskScheduler.schedule(() => n *= 2, 1);

        // Enqueue a high priority task
        TaskScheduler.schedule(() => n++, 0);

        // Give the tasks time to execute
        await Task.delay(100);

        // Following priority, increment before multiply. Should yield 202.
        postMessage(n);
      }`;
    let worker = new Worker(URL.createObjectURL(new Blob([code])));

    worker.onmessage = jest.fn();
    worker.postMessage(null);

    expect(worker.onmessage).toHaveBeenCalledWith(202);*/
  });

});
