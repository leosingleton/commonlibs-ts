// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Queue } from '../dotnet/Queue';

/** Calculates a moving average of a set of numbers */
export class MovingAverage {
  public constructor(initialValue: number, maxValues: number) {
    this._maxValues = maxValues;
    this._values = new Queue<number>();
    this._sum = 0;
    this.record(initialValue);
  }

  public record(value: number): void {
    this._values.enqueue(value);
    this._sum += value;

    if (this._values.getCount() > this._maxValues) {
      const oldValue = this._values.dequeue();
      this._sum -= oldValue;
    }

    this._average = Math.floor(this._sum / this._values.getCount());
  }

  public getValue(): number {
    return this._average;
  }

  private _maxValues: number;
  private _values: Queue<number>;
  private _sum: number;
  private _average: number;
}
