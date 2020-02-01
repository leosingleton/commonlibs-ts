// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/**
 * TypeScript port of C#'s Stopwatch class
 */
export class Stopwatch {
  /** Elapsed time in milliseconds, not counting the current elapsed time if running */
  private _elapsedMilliseconds = 0;

  /** Whether the stopwatch is currently running */
  private _isRunning = false;

  /** If running, time at which the stopwatch was started */
  private _startTime = 0;

  /** Gets the total elapsed time measured by the current instance, in milliseconds. */
  public getElapsedMilliseconds(): number {
    if (this._isRunning) {
      return this._elapsedMilliseconds + (now() - this._startTime);
    } else {
      return this._elapsedMilliseconds;
    }
  }

  /** Gets a value indicating whether the Stopwatch timer is running. */
  public isRunning(): boolean {
    return this._isRunning;
  }

  /** Stops time interval measurement and resets the elapsed time to zero. */
  public resetTimer(): void {
    this._elapsedMilliseconds = 0;
    this._isRunning = false;
  }

  /** Stops time interval measurement, resets the elapsed time to zero, and starts measuring elapsed time. */
  public restartTimer(): void {
    this.stopTimer();
    this._elapsedMilliseconds = 0;
    this.startTimer();
  }

  /** Starts, or resumes, measuring elapsed time for an interval. */
  public startTimer(): void {
    // According to the MSDN docs, Start() while running does nothing
    if (!this._isRunning) {
      this._startTime = now();
      this._isRunning = true;
    }
  }

  /**
   * Initializes a new Stopwatch instance, sets the elapsed time property to zero, and starts measuring elapsed time.
   */
  public static startNew(): Stopwatch {
    const result = new Stopwatch();
    result.startTimer();
    return result;
  }

  /** Stops measuring elapsed time for an interval. */
  public stopTimer(): void {
    // According to MSDN docs, Stop() while not running does nothing
    if (this._isRunning) {
      this._elapsedMilliseconds += now() - this._startTime;
      this._isRunning = false;
    }
  }
}

/**
 * performance.now() wrapper. May point to a polyfill on NodeJS or older browsers without support for the Performance
 * Timing API.
 */
let now: () => number;

/** Last value of the now() function. Used to prevent the counter from going backwards if the system clock changes. */
let _lastNow = 0;

if (typeof performance === 'undefined') {
  // Polyfill for performance.now()
  now = () => {
    _lastNow = Math.max(Date.now(), _lastNow);
    return _lastNow;
  };
} else {
  // Browser supports Performance Timing API
  now = () => performance.now();
}
