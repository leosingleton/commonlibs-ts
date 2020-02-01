// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/**
 * Seeded random number generator based on code from:
 * https://gist.github.com/blixt/f17b47c62508be59987b
 */
export class SeededRandom {
  public constructor(initialSeed: number) {
    this.nextSeed = initialSeed % 2147483647;
    if (this.nextSeed <= 0) {
      this.nextSeed += 2147483646;
    }
  }

  /** Returns a pseudo-random value between 1 and 2^32 - 2 */
  public nextInt(): number {
    return this.nextSeed = this.nextSeed * 16807 % 2147483647;
  }

  /** Returns a pseudo-random floating point number in range [0, 1) */
  public nextFloat(): number {
    return (this.nextInt() - 1) / 2147483646;
  }

  private nextSeed: number;
}
