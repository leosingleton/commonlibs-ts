// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Runtime } from '../Runtime';

describe('Runtime', () => {

  it('Detects NodeJS', () => {
    expect(Runtime.isNode).toBeTruthy();
    expect(Runtime.isWebWorker).toBeFalsy();
    expect(Runtime.isWindow).toBeFalsy();
  });

});
