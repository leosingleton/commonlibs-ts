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
    readyTasks.enqueue(lambda, priority);
    if (readyTasks.getCount() === 1) {
      executeTasksOnEventLoop();
    }
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
let readyTasks = new PriorityQueue<Lambda>();

/** Number of executeTasks() events queued on the event loop */
let executeTasksEvents = 0;

/** Queues a task on the event loop to call executeTasks() */
function executeTasksOnEventLoop(): void {
  executeTasksEvents++;
  if (typeof self !== 'undefined') {
    // Implementation for web pages and web workers...
    // window.postMessage() is the fastest method according to http://ajaxian.com/archives/settimeout-delay
    // Use self. instead of window. to be compatible with web workers.
    self.postMessage(eventData, '*');
  } else {
    // NodeJS has a setImmediate() which avoids the hacky postMessage() call
    setImmediate(() => executeTasks());
  }
}

/** Any unique string. Abbreviated version of "@leosingleton/commonlibs-ts/TaskScheduler" */
const eventData = '@ls/cl/TS';
if (typeof self !== 'undefined') {
  self.addEventListener('message', event => {
    if (event.data === eventData) {
      event.stopPropagation();
      executeTasks();
    }
  }, true);
}

/** Handler invoked on the event loop to execute tasks in the readyTasks queue */
function executeTasks(): void {
  executeTasksEvents--;

  try {
    let lambda = readyTasks.dequeue();
    lambda();
  } catch (err) {
    console.log(err);
  }

  // If more tasks remain in the queue, execute them. We could do so with a while loop, however, this would give
  // priority to tasks in the readyTasks queue over DOM events which may have been recently queued. Instead, dispatch
  // the next task at the back of the event loop.
  if (!readyTasks.isEmpty() && executeTasksEvents === 0) {
    executeTasksOnEventLoop();
  }
}
