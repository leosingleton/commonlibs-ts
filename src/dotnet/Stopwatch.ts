/**
 * TypeScript port of C#'s Stopwatch class
 */
export class Stopwatch {
  /** Elapsed time in milliseconds, not counting the current elapsed time if running */
  private _elapsedMilliseconds = 0;

  /** Whether the stopwatch is currently running */
  private _isRunning = false;

  /** If running, time at which the stopwatch was started */
  private _startTime: number;

  /** Gets the total elapsed time measured by the current instance, in milliseconds. */
  public getElapsedMilliseconds(): number {
    if (this._isRunning) {
      return this._elapsedMilliseconds + (performance.now() - this._startTime);
    } else {
      return this._elapsedMilliseconds;
    }
  }

  /** Gets a value indicating whether the Stopwatch timer is running. */
  public isRunning(): boolean {
    return this._isRunning;
  }

  /** Stops time interval measurement and resets the elapsed time to zero. */
  public reset(): void {
    this._elapsedMilliseconds = 0;
    this._isRunning = false;
  }

  /** Stops time interval measurement, resets the elapsed time to zero, and starts measuring elapsed time. */
  public restart(): void {
    this.stop();
    this._elapsedMilliseconds = 0;
    this.start();
  }

  /** Starts, or resumes, measuring elapsed time for an interval. */
  public start(): void {
    // According to the MSDN docs, Start() while running does nothing
    if (!this._isRunning) {
      this._startTime = performance.now();
      this._isRunning = true;
    }
  }

  /**
   * Initializes a new Stopwatch instance, sets the elapsed time property to zero, and starts measuring elapsed time.
   */
  public static startNew(): Stopwatch {
    let result = new Stopwatch();
    result.start();
    return result;
  }

  /** Stops measuring elapsed time for an interval. */
  public stop(): void {
    // According to MSDN docs, Stop() while not running does nothing
    if (this._isRunning) {
      this._elapsedMilliseconds += performance.now() - this._startTime;
      this._isRunning = false;
    }
  }
}
