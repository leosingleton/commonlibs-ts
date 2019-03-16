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
}

type Lambda = () => void;
const eventData = '@ls/cl/TS'; // Any unique string. Abbreviated version of "@leosingleton/commonlibs-ts/TaskScheduler"
let readyTasks = new PriorityQueue<Lambda>();

self.addEventListener('message', event => {
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
