// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { AsyncEventWaitHandle } from './AsyncEventWaitHandle';
import { IDisposable } from '../dotnet/Disposable';

/** Timer that behaves line an `EventWaitHandle`. Useful for the `AsyncEventWaitHandle.WhenAny()` method. */
export class AsyncTimerEvent extends AsyncEventWaitHandle implements IDisposable {
  public constructor(millisecondsDelay: number, repeat = false) {
    super(repeat, false);

    const f = repeat ? setInterval : setTimeout;
    this.intervalID = f(() => this.setEvent(), millisecondsDelay);
  }

  public dispose(): void {
    if (this.intervalID) {
      // According to https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval
      // clearInterval() and clearTimeout() are interchangeable and the intervalIDs are never reused. So it's safe to
      // simply call clearInterval() without tracking whether repeat == true or whether the non-repeatable timer has
      // ever fired.
      clearInterval(this.intervalID);
    }
  }

  private intervalID: number;
}
