// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { PriorityQueue } from '../collections/PriorityQueue';

/** Boolean used to special case behavior for NodeJS versus web browsers (the latter also includes web workers) */
let isNode = (typeof self === 'undefined');

/** globalThis isn't widely supported yet and breaks the Jest tests. Use this instead... */
let g = (isNode ? this : self) as any;

/** Boolean used to special case behavior when running inside a WebWorker */	
// This check comes from emscripten:	
// https://github.com/kripken/emscripten/blob/54b0f19d9e8130de16053b0915d114c346c99f17/src/shell.js	
let isWebWorker = (typeof g.importScripts === 'function');

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
  public static yield(priority = 0): Promise<void> {
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

  if (isNode || isWebWorker) {
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
if (typeof g[eventData] === 'undefined') {
  // We are the first instance of TaskScheduler to be initialized
  readyTasks = g[eventData] = new PriorityQueue<Lambda>();

  // Web browsers use a postMessage() call to themselves to work around the lack of setImmediate(). Only register the
  // event handler from one (the first) instance of TaskScheduler.
  if (!isNode && !isWebWorker) {
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
  readyTasks = g[eventData];
}

/** Handler invoked on the event loop to execute tasks in the readyTasks queue */
function executeTasks(): void {
  executeTasksEvents--;

  try {
    let lambda = readyTasks.dequeue();
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
