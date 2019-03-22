// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { AsyncTimerEvent } from '../AsyncTimerEvent';
import { Task } from '../../dotnet/Task';

describe('AsyncTimerEvent', () => {

  it('Tests the timer without repeat enabled', async () => {
    let timer = new AsyncTimerEvent(1000);
    let hasFired = false;
    setTimeout(async () => {
      await timer.waitAsync();
      hasFired = true;
    });

    await Task.delay(900);
    expect(hasFired).toBeFalsy();

    await Task.delay(200);
    expect(hasFired).toBeTruthy();
  });

  it('Tests the timer with repeat enabled', async () => {
    let timer = new AsyncTimerEvent(100, true);
    let fireCount = 0;
    setTimeout(async () => {
      while (fireCount < 12) {
        await timer.waitAsync();
        fireCount++;
      }
    });

    await Task.delay(1000);
    expect(fireCount).toBeGreaterThanOrEqual(8);
    expect(fireCount).toBeLessThanOrEqual(12);
    await Task.delay(500);
  });
});
