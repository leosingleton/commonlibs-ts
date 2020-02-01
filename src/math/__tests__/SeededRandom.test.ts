// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { SeededRandom } from '../SeededRandom';

describe('SeededRandom', () => {

  it('Generates random ints', () => {
    const rand = new SeededRandom(0);
    const int1 = rand.nextInt();
    const int2 = rand.nextInt();
    const int3 = rand.nextInt();

    // Values are > 0
    expect(int1).toBeGreaterThanOrEqual(0);
    expect(int2).toBeGreaterThanOrEqual(0);
    expect(int3).toBeGreaterThanOrEqual(0);

    // Values are integers
    expect(int1).toEqual(Math.floor(int1));
    expect(int2).toEqual(Math.floor(int2));
    expect(int3).toEqual(Math.floor(int3));
  });

  it('Generates random floats', () => {
    const rand = new SeededRandom(0);
    const float1 = rand.nextFloat();
    const float2 = rand.nextFloat();
    const float3 = rand.nextFloat();

    // Values are in the range [0, 1)
    expect(float1).toBeGreaterThanOrEqual(0);
    expect(float2).toBeGreaterThanOrEqual(0);
    expect(float3).toBeGreaterThanOrEqual(0);

    expect(float1).toBeLessThan(1);
    expect(float2).toBeLessThan(1);
    expect(float3).toBeLessThan(1);
  });

});
