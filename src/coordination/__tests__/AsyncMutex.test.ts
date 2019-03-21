// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { AsyncManualResetEvent } from '../AsyncManualResetEvent';
import { AsyncMutex } from '../AsyncMutex';
import { Task } from '../../dotnet/Task';

describe('AsyncMutex', () => {

  it('Performs mutual exclusion', async (done) => {
    let sharedValue = 0;
    let mutex = new AsyncMutex();
    let hundredEvent = new AsyncManualResetEvent();

    // Create 10 "threads" that increment a value 10 times each
    for (let n = 0; n < 10; n++) {
      setTimeout(async () => {
        await mutex.lock();

        let privateValue = sharedValue;
        for (let m = 0; m < 10; m++) {
          // If the mutex works, no other "thread" will increment sharedValue
          sharedValue++;
          privateValue++;
          expect(sharedValue).toEqual(privateValue);

          if (sharedValue === 100) {
            hundredEvent.set(); // The test case is complete
          }

          // Yield the CPU to give other "threads" a chance to run
          await Task.delay(0);
        }

        mutex.unlock();
      });
    }

    await hundredEvent.waitAsync();
    expect(sharedValue).toEqual(100);

    done();
  });

});
