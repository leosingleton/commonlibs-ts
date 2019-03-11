// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { AsyncEventWaitHandle } from './AsyncEventWaitHandle';

/**
 * Async version of .NET's System.Threading.AutoResetEvent
 */
export class AsyncAutoResetEvent extends AsyncEventWaitHandle {
  public constructor(initialState = false) {
    super(true, initialState);
  }
}
