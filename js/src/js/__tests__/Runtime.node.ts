// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Runtime } from '../Runtime';

describe('Runtime', () => {

  it('Detects NodeJS', () => {
    expect(Runtime.isInNode).toBeTruthy();
    expect(Runtime.isInWebWorker).toBeFalsy();
    expect(Runtime.isInWindow).toBeFalsy();
  });

});
