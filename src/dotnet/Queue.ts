// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

export class Queue<T> {
  public enqueue(value: T) {
    this._values.push(value);
  }

  /**
   * @returns Last value in the queue, or undefined if the queue is empty
   */
  public dequeue(): T | undefined {
    return this._values.shift();
  }

  public tryPeek(): T | undefined {
    return this._values[0];
  }

  public getCount(): number {
    return this._values.length;
  }

  public toArray(): T[] {
    return this._values;
  }

  public isEmpty(): boolean {
    return (this._values.length === 0);
  }

  private _values: T[] = [];
}
