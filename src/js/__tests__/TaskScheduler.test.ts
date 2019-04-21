// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { TaskScheduler } from '../TaskScheduler';
import { Stopwatch, Task } from '../../dotnet';
import { AsyncManualResetEvent } from '../../coordination';

describe('TaskScheduler', () => {

  it('Executes tasks in priority order', async () => {
    let n = 100;

    // Enqueue a low priority task
    TaskScheduler.schedule(() => n *= 2, 1);

    // Enqueue a high priority task
    TaskScheduler.schedule(() => n++, 0);

    // Give the tasks time to execute
    await Task.delay(100);

    // Following priority, increment before multiply
    expect(n).toEqual(202);
  });

  it('Executes tasks in priority with yield', async () => {
    let n = 100;

    // Enqueue a low priority task
    TaskScheduler.schedule(() => n *= 2, 1);

    // Enqueue a high priority task
    TaskScheduler.schedule(() => n++, 0);

    // Execute ourselves at the lowest priority
    await TaskScheduler.yield(2);
    n = n * n;

    // Following priority, increment then multiply then square
    expect(n).toEqual(202 * 202);
  });

  it('Executes tasks in priority with yield - case #2', async () => {
    let n = 100;

    // Enqueue a really low priority task
    TaskScheduler.schedule(() => n *= 2, 2);

    // Enqueue a high priority task
    TaskScheduler.schedule(() => n++, 0);

    // Execute ourselves at the middle priority
    await TaskScheduler.yield(1);
    n = n * n;

    // Following priority, increment then square then multiply
    expect(n).toEqual(101 * 101);
    await Task.delay(100);
    expect(n).toEqual(101 * 101 * 2);
  });

  it('Yield works in a loop', async () => {
    let count = 0;

    for (let n = 0; n < 100; n++) {
      await TaskScheduler.yield();
      count++;
    }

    expect(count).toEqual(100);
  });

  it('Executes lower priority than event handlers', async () => {
    let count = 0;
    let done = new AsyncManualResetEvent();

    let exec = (typeof requestAnimationFrame !== 'undefined') ? requestAnimationFrame : setTimeout;
    let event = async () => {
      if (++count === 100) {
        done.set();
      } else {
        // Launch another event
        exec(event);
      }

      while (!done.getIsSet()) {
        // Busy wait 10ms to tie up the CPU
        let timer = Stopwatch.startNew();
        while (timer.getElapsedMilliseconds() < 10);

        // Yield to let the event handlers execute
        await TaskScheduler.yield();
      }
    };
    exec(event);

    await done.waitAsync();
    expect(count).toEqual(100);
  });

});
