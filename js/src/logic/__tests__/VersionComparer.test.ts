// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { VersionComparer } from '../VersionComparer';

describe('VersionComparer', () => {

  it('2.0 > 1.1', () => {
    const v1 = [ 2, 0 ];
    const v2 = [ 1, 1 ];
    expect(VersionComparer.lower(v1, v2)).toEqual(v2);
  });

  it('1.0 < 1.1', () => {
    const v1 = [ 1, 0 ];
    const v2 = [ 1, 1 ];
    expect(VersionComparer.lower(v1, v2)).toEqual(v1);
  });

  it('3.4 == 3.4', () => {
    const v1 = [ 3, 4 ];
    const v2 = [ 3, 4 ];
    expect(VersionComparer.lower(v1, v2)).toEqual(v1);
  });

  it('1.1.4 < 2.0.0', () => {
    const v1 = [ 1, 1, 4 ];
    const v2 = [ 2, 0, 0 ];
    expect(VersionComparer.lower(v1, v2)).toEqual(v1);
  });

  it('2.4.0 > 2.2.6', () => {
    const v1 = [ 2, 4, 0 ];
    const v2 = [ 2, 2, 6 ];
    expect(VersionComparer.lower(v1, v2)).toEqual(v2);
  });

  it('3.4.2 == 3.4.2', () => {
    const v1 = [ 3, 4, 2 ];
    const v2 = [ 3, 4, 2 ];
    expect(VersionComparer.lower(v1, v2)).toEqual(v1);
  });

});
