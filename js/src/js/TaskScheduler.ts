// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Runtime } from './Runtime';
import { ErrorType, reportError } from './UnhandledError';
import { PriorityQueue } from '../collections/PriorityQueue';

export class TaskScheduler {
  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented `setImmediate()`
   * function in JavaScript.
   * @param lambda Lambda function to execute
   * @param priority Priority, expressed as an integer where 0 is highest
   */
  public static schedule(lambda: () => void, priority = 0): void {
    this.initialize();
    this.impl.schedule(lambda, priority);
  }

  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented `setImmediate()`
   * function in JavaScript.
   *
   * This variation of `schedule()` supports async functions which return a `Promise` and returns exceptions via the
   * `UnhandledError` class.
   *
   * @param lambda Lambda function to execute
   * @param priority Priority, expressed as an integer where 0 is highest
   */
  public static scheduleAsyncVoid(lambda: () => Promise<void>, priority = 0): void {
    this.schedule(() => {
      lambda().then(() => {}, err => reportError(err, ErrorType.ScheduledPromiseRejection));
    }, priority);
  }

  /**
   * Yields the CPU to allow new events and higher-priority tasks a chance to execute
   * @param priority Priority of the current thread. Execution will resume once all tasks higher-priority than this
   *    have completed.
   */
  public static yieldAsync(priority = 0): Promise<void> {
    this.initialize();
    return this.impl.yieldAsync(priority);
  }

  /**
   * Called at every entry point to initialize the task scheduler on first use
   * @returns True if the task scheduler is supported; false if we are in NodeJS or a web worker
   */
  private static initialize(): void {
    if (!this.impl) {
      this.impl = new TaskSchedulerImpl();
    }
  }

  /** Underlying task scheduler implementation */
  private static impl: TaskSchedulerImpl;
}

/** Any unique string. Abbreviated version of `"@leosingleton/commonlibs-ts/TaskScheduler"` */
const eventDataPrefix = '@ls/cl/TS';

type Lambda = () => void;

/** Implementation of the task scheduler for web browsers */
class TaskSchedulerImpl {
  public schedule(lambda: () => void, priority: number): void {
    this.readyTasks.enqueue(lambda, priority);
    if (this.readyTasks.getCount() === 1) {
      this.executeTasksOnEventLoop();
    }
  }

  public yieldAsync(priority: number): Promise<void> {
    return new Promise<void>((resolve, _reject) => {
      this.schedule(() => resolve(), priority);
    });
  }

  /** The global task queue. Initialized in the constructor below. */
  private readyTasks: PriorityQueue<Lambda>;

  /** Unique string assigned to this instance of `TaskScheduler` */
  private eventData: string;

  /** Number of `executeTasks()` events queued on the event loop */
  private executeTasksEvents = 0;

  /** Queues a task on the event loop to call `executeTasks()` */
  private executeTasksOnEventLoop(): void {
    this.executeTasksEvents++;

    if (Runtime.isInNode || Runtime.isInWebWorker) {
      // NodeJS has a setImmediate() which avoids the hacky postMessage() call, but if we as much as reference it,
      // Webpack loads a polyfill which breaks web workers.
      //
      // Web workers postMessage behaves differently from that of a web page and is for sending events back to the owner
      // of the worker. In both cases, use the slower setTimeout() instead.
      setTimeout(() => this.executeTasks());
    } else {
      // Implementation for web pages...
      // window.postMessage() is the fastest method according to http://ajaxian.com/archives/settimeout-delay
      window.postMessage(this.eventData, '*');
    }
  }

  public constructor() {
    // Use a global variable to keep a counter of the number of instances
    let instanceCount = Runtime.globalObject[eventDataPrefix];
    if (typeof instanceCount === 'number') {
      // If we get here, there are two separate instances of TaskScheduler running in the same environment. This is not
      // a serious problem, as we will add a unique suffix to the eventData to ensure the messages are received by the
      // correct instance . However, it generally indicates a bundler like Webpack embedded the TaskScheduler multiple
      // times, which means the priorities won't be honored cross-instance. Check for mismatched versions of
      // @leosingleton/commonlibs or other build configuration errors.
      console.log('Warning: Multiple TaskScheduler instances');
      Runtime.globalObject[eventDataPrefix] = ++instanceCount;
    } else {
      Runtime.globalObject[eventDataPrefix] = instanceCount = 1;
    }
    const eventData = this.eventData = `${eventDataPrefix}/${instanceCount}`;

    // Initialize the task queue and message handlers
    this.readyTasks = new PriorityQueue<Lambda>();

    // Web browsers use a postMessage() call to themselves to work around the lack of setImmediate(). Only register
    // the event handler from one (the first) instance of TaskScheduler.
    if (!Runtime.isInNode && !Runtime.isInWebWorker) {
      self.addEventListener('message', event => {
        if (event.data === eventData) {
          event.stopPropagation();
          this.executeTasks();
        }
      }, true);
    }
  }

  /** Handler invoked on the event loop to execute tasks in the `readyTasks` queue */
  private executeTasks(): void {
    this.executeTasksEvents--;

    try {
      const lambda = this.readyTasks.dequeue();
      lambda();
    } finally {
      // If more tasks remain in the queue, execute them. We could do so with a while loop, however, this would give
      // priority to tasks in the readyTasks queue over DOM events which may have been recently queued. Instead,
      // dispatch the next task at the back of the event loop.
      if (!this.readyTasks.isEmpty() && this.executeTasksEvents === 0) {
        this.executeTasksOnEventLoop();
      }
    }
  }
}
