// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Runtime } from './Runtime';
import { PriorityQueue } from '../collections/PriorityQueue';

type Lambda = () => void;

/** The global task queue. Initialized below. */
let readyTasks: PriorityQueue<Lambda>;

export class TaskScheduler {
  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented setImmediate()
   * function in JavaScript.
   * @param lambda Lambda function to execute
   * @param priority Priority, expressed as an integer where 0 is highest
   */
  public static schedule(lambda: () => void, priority = 0): void {
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
  public static yieldAsync(priority = 0): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.schedule(() => resolve(), priority);
    });
  }
}

/** Number of executeTasks() events queued on the event loop */
let executeTasksEvents = 0;

/** Queues a task on the event loop to call executeTasks() */
function executeTasksOnEventLoop(): void {
  executeTasksEvents++;

  if (Runtime.isInNode || Runtime.isInWebWorker) {
    // NodeJS has a setImmediate() which avoids the hacky postMessage() call, but if we as much as reference it,
    // Webpack loads a polyfill which breaks web workers.
    //
    // Web workers postMessage behaves differently from that of a web page and is for sending events back to the owner
    // of the worker. In both cases, use the slower setTimeout() instead.
    setTimeout(() => executeTasks());
  } else {
    // Implementation for web pages...
    // window.postMessage() is the fastest method according to http://ajaxian.com/archives/settimeout-delay
    window.postMessage(eventData, '*');
  }
}

/** Any unique string. Abbreviated version of "@leosingleton/commonlibs-ts/TaskScheduler" */
const eventData = '@ls/cl/TS';

// Initialize the task queue and message handlers
if (typeof Runtime.globalObject[eventData] === 'undefined') {
  // We are the first instance of TaskScheduler to be initialized
  readyTasks = Runtime.globalObject[eventData] = new PriorityQueue<Lambda>();

  // Web browsers use a postMessage() call to themselves to work around the lack of setImmediate(). Only register the
  // event handler from one (the first) instance of TaskScheduler.
  if (!Runtime.isInNode && !Runtime.isInWebWorker) {
    self.addEventListener('message', event => {
      if (event.data === eventData) {
        event.stopPropagation();
        executeTasks();
      }
    }, true);
  }
} else {
  // If we get here, there are two separate instances of TaskScheduler running in the same environment. This is not a
  // serious problem, as we will handle this case by ensuring the task queue is global. However, it generally indicates
  // a bundler like Webpack embedded the TaskScheduler multiple times, which is inefficient. Check for mismatched
  // versions of @leosingleton/commonlibs or other build configuration errors.
  console.log('Warning: Multiple TaskScheduler instances');
  readyTasks = Runtime.globalObject[eventData];
}

/** Handler invoked on the event loop to execute tasks in the readyTasks queue */
function executeTasks(): void {
  executeTasksEvents--;

  try {
    const lambda = readyTasks.dequeue();
    lambda();
  } finally {
    // If more tasks remain in the queue, execute them. We could do so with a while loop, however, this would give
    // priority to tasks in the readyTasks queue over DOM events which may have been recently queued. Instead, dispatch
    // the next task at the back of the event loop.
    if (!readyTasks.isEmpty() && executeTasksEvents === 0) {
      executeTasksOnEventLoop();
    }
  }
}
