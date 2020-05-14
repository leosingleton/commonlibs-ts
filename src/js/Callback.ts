// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { TaskScheduler } from './TaskScheduler';
import { UnhandledError } from './UnhandledError';

/** Lambda function for a synchronous callback */
export type Callback = () => void;

/** Lambda function for an asynchronous callback */
export type CallbackAsync = () => Promise<void>;

/** Lambda function for a synchronous or asynchronous callback */
export type CallbackMaybeAsync = Callback | CallbackAsync;

/**
 * Executes a callback. Wraps it in a try/catch block so that any exceptions are sent to the `UnhandledError` class and
 * not to this thread.
 * @param callback Callback function to execute
 * @param useTask If `false` (default), the callbacks are executed on the current thread. In the case of async
 *    callbacks, the first portion (until the first `await`) is executed on the current thread. If `true`, the
 *    `TaskScheduler` is used to delay the execution of the callbacks.
 */
export function executeCallback(callback: CallbackMaybeAsync, useTask = false): void {
  executeCallbacks(callback, useTask);
}

/**
 * Executes a callback or array of callbacks. Wraps each in a try/catch block so that any exceptions are sent to the
 * `UnhandledError` class and not to this thread.
 * @param callback Callback function or array of callback functions to execute
 * @param useTask If `false` (default), the callbacks are executed on the current thread. In the case of async
 *    callbacks, the first portion (until the first `await`) is executed on the current thread. If `true`, the
 *    `TaskScheduler` is used to delay the execution of the callbacks.
 */
export function executeCallbacks(callbacks: CallbackMaybeAsync | CallbackMaybeAsync[], useTask = false): void {
  const callbacksArray = (typeof callbacks === 'function') ? [callbacks] : callbacks;

  if (useTask) {
    TaskScheduler.schedule(() => dispatchCallbacks(callbacksArray));
  } else {
    dispatchCallbacks(callbacksArray);
  }
}

function dispatchCallbacks(callbacks: CallbackMaybeAsync[]): void {
  for (const callback of callbacks) {
    try {
      const result = callback();
      if (result) {
        TaskScheduler.scheduleAsyncVoid(async () => {
          try {
            await result;
          } catch (err) {
            UnhandledError.reportError(err);
          }
        });
      }
    } catch (err) {
      UnhandledError.reportError(err);
    }
  }
}
