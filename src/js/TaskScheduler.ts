// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { PriorityQueue } from '../collections/PriorityQueue';

export class TaskScheduler {
  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented setImmediate()
   * function in JavaScript.
   * @param lambda Lambda function to execute
   * @param priority Priority, expressed as an integer where 0 is highest
   */
  public static schedule(lambda: Lambda, priority = 0): void {
    // window.postMessage() is the fastest method according to http://ajaxian.com/archives/settimeout-delay
    readyTasks.enqueue(lambda, priority);
    self.postMessage(eventData, '*');
  }

  /**
   * Yields the CPU to allow new events and higher-priority tasks a chance to execute
   * @param priority Priority of the current thread. Execution will resume once all tasks higher-priority than this
   *    have completed.
   */
  public static yield(priority = 0): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.schedule(() => resolve(), priority);
    });
  }
}

type Lambda = () => void;
const eventData = '@ls/cl/TS'; // Any unique string. Abbreviated version of "@leosingleton/commonlibs-ts/TaskScheduler"
let readyTasks = new PriorityQueue<Lambda>();

self.addEventListener('message', event => {
  if (event.data === eventData) {
    event.stopPropagation();
    console.log('Tasks', readyTasks);

    while (!readyTasks.isEmpty()) {
      let lambda = readyTasks.dequeue();
      try {
        console.log('Executing', lambda);
        lambda();
      } catch (err) {
        console.log(err);
      }
    }
    console.log('Done');
  }
}, true);
