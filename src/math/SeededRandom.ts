// src/fim/SeededRandom.ts
// Fast Image Manipulation Library
// Copyright 2016-2018 Leo C. Singleton IV <leo@leosingleton.com>

/**
 * Seeded random number generator based on code from:
 * https://gist.github.com/blixt/f17b47c62508be59987b
 */
export class SeededRandom {
  constructor(initialSeed: number) {
    this.nextSeed = initialSeed % 2147483647;
    if (this.nextSeed <= 0) {
      this.nextSeed += 2147483646;
    }
  }

  /** Returns a pseudo-random value between 1 and 2^32 - 2 */
  nextInt(): number {
    return this.nextSeed = this.nextSeed * 16807 % 2147483647;
  }

  /** Returns a pseudo-random floating point number in range [0, 1) */
  nextFloat(): number {
    return (this.nextInt() - 1) / 2147483646;
  }

  private nextSeed: number;
}
