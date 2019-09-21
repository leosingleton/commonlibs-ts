// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { DocumentReady } from '../DocumentReady';

describe('DocumentReady', () => {

  it('Detects document ready', async () => {
    // For Node.js, it always reports true. For web browsers, the test framework has already waited.
    expect(DocumentReady.isReady()).toBeTruthy();
    await DocumentReady.waitUntilReady();
    expect(DocumentReady.isReady()).toBeTruthy();
  });

});
