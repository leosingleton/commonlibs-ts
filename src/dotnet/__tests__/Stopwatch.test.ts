// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Stopwatch } from '../Stopwatch';
import { Task } from '../Task';

describe('Stopwatch', () => {

  it('Tests basic timing', async () => {
    let stopwatch = new Stopwatch();
    stopwatch.startTimer();
    await Task.delayAsync(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);
  });

  it('Tests stop', async () => {
    let stopwatch = Stopwatch.startNew();
    await Task.delayAsync(500);
    stopwatch.stopTimer();
    await Task.delayAsync(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);

    // stop() when stopped does nothing
    stopwatch.stopTimer();
    await Task.delayAsync(500);
    let time2 = stopwatch.getElapsedMilliseconds();
    expect(time2).toEqual(time);

    // Start again
    stopwatch.startTimer();
    await Task.delayAsync(500);
    let time3 = stopwatch.getElapsedMilliseconds();
    expect(time3).toBeGreaterThanOrEqual(800);
    expect(time3).toBeLessThanOrEqual(1200);
  });

  it('Tests restart', async () => {
    let stopwatch = Stopwatch.startNew();
    await Task.delayAsync(500);
    stopwatch.restartTimer();
    await Task.delayAsync(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);
  });

  it('Tests reset', async () => {
    let stopwatch = Stopwatch.startNew();
    await Task.delayAsync(500);
    stopwatch.resetTimer();
    await Task.delayAsync(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toEqual(0);
  })
});
