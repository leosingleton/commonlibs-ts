// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { SampleConfig } from './SampleConfig';

describe('ConfigurationOptions', () => {

  it('Populates with defaults', () => {
    const config = new SampleConfig();
    expect(config.localString).toBe('Hello');
    expect(config.sessionNumber).toBe(42);
    expect(config.noneBoolean).toBeTruthy();
  });

  it('Throws an exception if writing from NodeJS', () => {
    const config = new SampleConfig();
    expect(() => config.writeToStorage({ localString: 'New String' })).toThrowError();
  });

});
