// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { TaskScheduler } from '../TaskScheduler';
import { Task } from '../../dotnet/Task';

describe('Task', () => {

  it('Executes tasks in priority order', async () => {
    let n = 100;

    // Enqueue a low priority task
    TaskScheduler.schedule(() => {
      n *= 2;
    }, 1);

    // Enqueue a high priority task
    TaskScheduler.schedule(() => {
      n++;
    }, 0);

    // Give the tasks time to execute
    await Task.delay(100);

    // Following priority, increment before multiply
    expect(n).toEqual(202);
  });

  it('Executes tasks in priority with yield', async () => {
    let n = 100;

    // Enqueue a low priority task
    TaskScheduler.schedule(() => {
      n *= 2;
    }, 1);

    // Enqueue a high priority task
    TaskScheduler.schedule(() => {
      n++;
    }, 0);

    // Execute ourselves at the lowest priority
    await TaskScheduler.yield(2);
    n = n * n;

    // Following priority, increment then multiply then square
    expect(n).toEqual(202 * 202);
  });

});
