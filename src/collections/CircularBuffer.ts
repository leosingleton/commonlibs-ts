// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/**
 * Holds a circular buffer of numbers
 */
export class CircularBuffer {
  public constructor(size: number) {
    this.resizeBuffer(size);
  }

  public getLength(): number {
    return this.vals.length;
  }

  public resizeBuffer(size: number) {
    this.vals = new Array<number>(size);
    this.nextValue = 0;
  }

  public pushValue(value: number): void {
    // Insert the value into the array. Store the previous value for the optimizations below.
    const prevValue = this.vals[this.nextValue];
    this.vals[this.nextValue] = value;

    // When we reach the end of the circular buffer, wrap around to the beginning.
    if (++this.nextValue >= this.vals.length) {
      this.nextValue = 0;
    }

    // The rest of this function is just performance optimizations for min/max/mean...

    if (this.cachedMin) {
      if (value <= this.cachedMin) {
        // The new value is the new minimum
        this.cachedMin = value;
      } else if (prevValue === this.cachedMin) {
        // The old value was the minimum. We'll have to traverse the list to find the new minimum.
        this.cachedMin = undefined;
      }
    }

    if (this.cachedMax) {
      if (value >= this.cachedMax) {
        // The new value is the new maximum
        this.cachedMax = value;
      } else if (prevValue === this.cachedMax) {
        // The old value was the maximum. We'll have to traverse the list to find the new maximum.
        this.cachedMax = undefined;
      }
    }

    if (this.cachedSum) {
      // Calculate the new sum
      this.cachedSum += value - prevValue;
    }
  }

  public minValue(): number {
    if (!this.cachedMin) {
      let min = this.vals[0];

      for (let n = 1; n < this.vals.length; n++) {
        const value = this.vals[n];
        if (value < min) {
          min = value;
        }
      }

      this.cachedMin = min;
    }

    return this.cachedMin;
  }

  public maxValue(): number {
    if (!this.cachedMax) {
      let max = this.vals[0];

      for (let n = 1; n < this.vals.length; n++) {
        const value = this.vals[n];
        if (value > max) {
          max = value;
        }
      }

      this.cachedMax = max;
    }

    return this.cachedMax;
  }

  public meanValue(): number {
    if (!this.cachedSum) {
      let sum = 0;

      for (const value of this.vals) {
        sum += value;
      }

      this.cachedSum = sum;
    }

    return (this.cachedSum / this.vals.length);
  }

  private vals: number[];
  private nextValue: number;

  // The following cached values are used to optimize the min/max/mean functions. They are left undefined until the
  // corresponding function is called. Once set, it is assumed the function will be called again soon, so the running
  // values are calculated whenever possible.
  private cachedMin: number;
  private cachedMax: number;
  private cachedSum: number;
}
