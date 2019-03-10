import { AsyncTimerEvent } from '../coordination/AsyncTimerEvent';

export class Task {
  /**
   * Blocks the current execution for the specified number of milliseconds. Equivalent to Task.Delay() in C#.
   * @param millisecondsDelay Number of milliseconds to delay
   */
  public static delay(millisecondsDelay: number): Promise<void> {
    let event = new AsyncTimerEvent(millisecondsDelay);
    return event.waitAsync();
  }
}
