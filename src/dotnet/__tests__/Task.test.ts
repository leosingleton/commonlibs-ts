// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Task } from '../Task';

describe('Task', () => {

  it('Task.run() executes asynchronously', async () => {
    let n = 1;

    function f() {
      Task.run(() => {
        while (n < 100) {
          n += 1;
          f();
        }
      });
    }

    f();

    // The value should still be 1 because the increment happens asynchronously
    expect(n).toEqual(1);

    // Give the tasks some time to execute
    await Task.delayAsync(100);

    // All 100 iterations should complete in a few milliseconds
    expect(n).toEqual(100);
  });

  it('Task.runAsyncVoid() executes asynchronously', async () => {
    let executed = false;

    Task.runAsyncVoid(async () => {
      await Task.delayAsync(100);
      executed = true;
    });

    expect(executed).toBeFalsy();
    await Task.delayAsync(200);
    expect(executed).toBeTruthy();
  });

});
