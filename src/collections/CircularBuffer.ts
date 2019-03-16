// src/fim/CircularBuffer.ts
// Fast Image Manipulation Library
// Copyright 2016-2018 Leo C. Singleton IV <leo@leosingleton.com>

/**
 * Holds a circular buffer of numbers
 */
export class CircularBuffer {
  constructor(size: number) {
    this.resize(size);
  }

  getLength(): number {
    return this.vals.length;
  }

  resize(size: number) {
    this.vals = new Array<number>(size);
    this.next = 0;
  }

  push(value: number): void {
    // Insert the value into the array. Store the previous value for the optimizations below.
    let prevValue = this.vals[this.next];
    this.vals[this.next] = value;

    // When we reach the end of the circular buffer, wrap around to the beginning.
    if (++this.next >= this.vals.length) {
      this.next = 0;
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

  min(): number {
    if (!this.cachedMin) {
      let min = this.vals[0];
    
      for (let n = 1; n < this.vals.length; n++) {
        let value = this.vals[n];
        if (value < min) {
          min = value;
        }
      }

      this.cachedMin = min;
    }

    return this.cachedMin;
  }

  max(): number {
    if (!this.cachedMax) {
      let max = this.vals[0];
      
      for (let n = 1; n < this.vals.length; n++) {
        let value = this.vals[n];
        if (value > max) {
          max = value;
        }
      }

      this.cachedMax = max;
    }

    return this.cachedMax;
  }

  mean(): number {
    if (!this.cachedSum) {
      let sum = 0;

      for (let n = 0; n < this.vals.length; n++) {
        sum += this.vals[n];
      }

      this.cachedSum = sum;
    }

    return (this.cachedSum / this.vals.length);
  }

  private vals: number[];
  private next: number;

  // The following cached values are used to optimize the min/max/mean functions. They are left undefined until the
  // corresponding function is called. Once set, it is assumed the function will be called again soon, so the running
  // values are calculated whenever possible.
  private cachedMin: number;
  private cachedMax: number;
  private cachedSum: number;
}
