// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Stopwatch } from '../Stopwatch';
import { Task } from '../Task';

describe('Stopwatch', () => {

  it('Tests basic timing', async (done) => {
    let stopwatch = new Stopwatch();
    stopwatch.start();
    await Task.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);
    done();
  });

  it('Tests stop', async (done) => {
    let stopwatch = Stopwatch.startNew();
    await Task.delay(500);
    stopwatch.stop();
    await Task.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);

    // stop() when stopped does nothing
    stopwatch.stop();
    await Task.delay(500);
    let time2 = stopwatch.getElapsedMilliseconds();
    expect(time2).toEqual(time);

    // Start again
    stopwatch.start();
    await Task.delay(500);
    let time3 = stopwatch.getElapsedMilliseconds();
    expect(time3).toBeGreaterThanOrEqual(800);
    expect(time3).toBeLessThanOrEqual(1200);

    done();
  });

  it('Tests restart', async (done) => {
    let stopwatch = Stopwatch.startNew();
    await Task.delay(500);
    stopwatch.restart();
    await Task.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);
    done();
  });

  it('Tests reset', async (done) => {
    let stopwatch = Stopwatch.startNew();
    await Task.delay(500);
    stopwatch.reset();
    await Task.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toEqual(0);
    done();
  })
});
