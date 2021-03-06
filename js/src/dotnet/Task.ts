// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { TaskScheduler } from '../js/TaskScheduler';

/** Useful functions for `Promises` that mirror C#'s `Task` class */
export class Task {
  /**
   * Blocks the current execution for the specified number of milliseconds. Equivalent to `Task.Delay()` in C#.
   * @param millisecondsDelay Number of milliseconds to delay
   */
  public static delayAsync(millisecondsDelay: number): Promise<void> {
    if (millisecondsDelay > 0) {
      // Create a Promise and use setTimeout() to call resolve after the right delay
      return new Promise<void>((resolve, _reject) => {
        setTimeout(() => resolve(), millisecondsDelay);
      });
    } else {
      // Skip setTimeout() as it has a minimum delay of 4-10 ms
      return Promise.resolve();
    }
  }

  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented `setImmediate()`
   * function in JavaScript.
   * @param lambda Lambda function to execute
   */
  public static run(lambda: () => void): void {
    // The functionality has been replaced with TaskScheduler. This function just exists as a simple wrapper for
    // backwards-compatibility.
    TaskScheduler.schedule(lambda);
  }

  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented `setImmediate()`
   * function in JavaScript.
   *
   * This variation of `run()` supports async functions which return a `Promise` and returns exceptions via the
   * `UnhandledError` class.
   *
   * @param lambda Lambda function to execute
   */
  public static runAsyncVoid(lambda: () => Promise<void>): void {
    // The functionality has been replaced with TaskScheduler. This function just exists as a simple wrapper for
    // backwards-compatibility.
    TaskScheduler.scheduleAsyncVoid(lambda);
  }
}
