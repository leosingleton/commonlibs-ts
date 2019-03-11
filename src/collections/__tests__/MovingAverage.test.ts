// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { MovingAverage } from '../MovingAverage';

describe('MovingAverage', () => {

  it('MovingAverage helper class works', () => {
    let ma = new MovingAverage(100, 3);
    expect(ma.getValue()).toEqual(100);

    ma.record(50);
    expect(ma.getValue()).toEqual(75);

    ma.record(150);
    expect(ma.getValue()).toEqual(100);

    ma.record(250);
    expect(ma.getValue()).toEqual(150);
  });
  
});
