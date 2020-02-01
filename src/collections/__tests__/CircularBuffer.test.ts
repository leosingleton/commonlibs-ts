// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { CircularBuffer } from '../CircularBuffer';

describe('CircularBuffer', () => {
  it('calculates min/mean/max', () => {
    const c = new CircularBuffer(5);

    c.pushValue(1);
    c.pushValue(2);
    c.pushValue(3);
    c.pushValue(4);
    c.pushValue(5);

    expect(c.minValue()).toEqual(1);
    expect(c.meanValue()).toEqual(3);
    expect(c.maxValue()).toEqual(5);

    c.pushValue(6); // Replaces 1
    c.pushValue(7); // Replaces 2

    expect(c.minValue()).toEqual(3);
    expect(c.meanValue()).toEqual(5);
    expect(c.maxValue()).toEqual(7);

    c.pushValue(3); // Replaces 3
    c.pushValue(5); // Replaces 4
    c.pushValue(5); // Replaces 5
    c.pushValue(5); // Replaces 6

    expect(c.minValue()).toEqual(3);
    expect(c.meanValue()).toEqual(5);
    expect(c.maxValue()).toEqual(7);

    c.pushValue(2); // Replaces 7

    expect(c.minValue()).toEqual(2);
    expect(c.meanValue()).toEqual(4);
    expect(c.maxValue()).toEqual(5);
  });
});
