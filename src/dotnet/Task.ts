// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Queue } from './Queue';

/**
 * Useful functions for Promises that mirror C#'s Task class
 */
export class Task {
  /**
   * Blocks the current execution for the specified number of milliseconds. Equivalent to Task.Delay() in C#.
   * @param millisecondsDelay Number of milliseconds to delay
   */
  public static delay(millisecondsDelay: number): Promise<void> {
    if (millisecondsDelay > 0) {
      // Create a Promise and use setTimeout() to call resolve after the right delay
      let onResolve: (value?: void) => void;

      setTimeout(() => onResolve(), millisecondsDelay);
  
      return new Promise<void>((resolve, reject) => {
        onResolve = resolve;
      });  
    } else {
      // Skip setTimeout() as it has a minimum delay of 4-10 ms
      return Promise.resolve();
    }
  }

  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented setImmediate()
   * function in JavaScript.
   * @param lambda Lambda function to execute
   */
  public static run(lambda: Lambda): void {
    // window.postMessage() is the fastest method according to http://ajaxian.com/archives/settimeout-delay
    readyTasks.enqueue(lambda);
    window.postMessage(eventData, '*');
  }
}

type Lambda = () => void;
const eventData = '@ls/cl/T.r'; // Any unique string. Abbreviated version of "@leosingleton/commonlibs-ts/Task.run"
let readyTasks = new Queue<Lambda>();

window.addEventListener('message', event => {
  if (event.data === eventData) {
    event.stopPropagation();
    while (!readyTasks.isEmpty()) {
      let lambda = readyTasks.dequeue();
      try {
        lambda();
      } catch (err) {
        console.log(err);
      }
    }
  }
}, true);
