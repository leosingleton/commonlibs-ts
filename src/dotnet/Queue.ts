// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/**
 * First-In First-Out Queue. Mirror's the class in .NET for code portability.
 */
export class Queue<T> {
  /**
   * Enqueues a value
   * @param value Value
   */
  public enqueue(value: T) {
    this._values.push(value);
  }

  /**
   * Removes and returns the value at the head of the queue
   * @returns First value in the queue, or undefined if the queue is empty
   */
  public dequeue(): T | undefined {
    return this._values.shift();
  }

  /**
   * Returns the value at the head of the queue without removing it
   * @returns First value in the queue, or undefined if the queue is empty
   */
  public tryPeek(): T | undefined {
    return this._values[0];
  }

  /**
   * Returns the number of values in the queue
   */
  public getCount(): number {
    return this._values.length;
  }

  /**
   * Returns the queue as an array
   */
  public toValueArray(): T[] {
    return this._values;
  }

  /**
   * Returns true if the queue is empty; false otherwise
   */
  public isEmpty(): boolean {
    return (this._values.length === 0);
  }

  private _values: T[] = [];
}
