import { AsyncTimerEvent } from '../../coordination/AsyncTimerEvent';
import { Stopwatch } from '../Stopwatch';

describe("Stopwatch", () => {

  it("Tests basic timing", async () => {
    let stopwatch = new Stopwatch();
    stopwatch.start();
    await AsyncTimerEvent.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);
  });

  it("Tests stop", async () => {
    let stopwatch = Stopwatch.startNew();
    await AsyncTimerEvent.delay(500);
    stopwatch.stop();
    await AsyncTimerEvent.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);

    // stop() when stopped does nothing
    stopwatch.stop();
    await AsyncTimerEvent.delay(500);
    let time2 = stopwatch.getElapsedMilliseconds();
    expect(time2).toEqual(time);

    // Start again
    stopwatch.start();
    await AsyncTimerEvent.delay(500);
    let time3 = stopwatch.getElapsedMilliseconds();
    expect(time3).toBeGreaterThanOrEqual(800);
    expect(time3).toBeLessThanOrEqual(1200);
  });

  it("Tests restart", async () => {
    let stopwatch = Stopwatch.startNew();
    await AsyncTimerEvent.delay(500);
    stopwatch.restart();
    await AsyncTimerEvent.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toBeGreaterThanOrEqual(300);
    expect(time).toBeLessThanOrEqual(700);
  });

  it("Tests reset", async () => {
    let stopwatch = Stopwatch.startNew();
    await AsyncTimerEvent.delay(500);
    stopwatch.reset();
    await AsyncTimerEvent.delay(500);
    let time = stopwatch.getElapsedMilliseconds();
    expect(time).toEqual(0);
  })
});
