// src/fim/CircularBuffer.spec.ts
// Fast Image Manipulation Library
// Copyright 2016-2018 Leo C. Singleton IV <leo@leosingleton.com>

import { CircularBuffer } from '../CircularBuffer';

describe("CircularBuffer", () => {
  it("calculates min/mean/max", () => {
    let c = new CircularBuffer(5);

    c.push(1);
    c.push(2);
    c.push(3);
    c.push(4);
    c.push(5);

    expect(c.min()).toEqual(1);
    expect(c.mean()).toEqual(3);
    expect(c.max()).toEqual(5);

    c.push(6); // Replaces 1
    c.push(7); // Replaces 2
    
    expect(c.min()).toEqual(3);
    expect(c.mean()).toEqual(5);
    expect(c.max()).toEqual(7);

    c.push(3); // Replaces 3
    c.push(5); // Replaces 4
    c.push(5); // Replaces 5
    c.push(5); // Replaces 6
    
    expect(c.min()).toEqual(3);
    expect(c.mean()).toEqual(5);
    expect(c.max()).toEqual(7);

    c.push(2); // Replaces 7

    expect(c.min()).toEqual(2);
    expect(c.mean()).toEqual(4);
    expect(c.max()).toEqual(5);
  });
});
