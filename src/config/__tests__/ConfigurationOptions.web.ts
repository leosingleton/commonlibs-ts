// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { SampleConfig } from './SampleConfig';

describe('ConfigurationOptions', () => {

  // Clean up local and session storage before each test
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('Populates with defaults', () => {
    let config = new SampleConfig();
    expect(config.localString).toBe('Hello');
    expect(config.sessionNumber).toBe(42);
    expect(config.noneBoolean).toBeTruthy();
  });

  it('Persists local storage', () => {
    let config = new SampleConfig();
    config.writeToStorage({ localString: 'New String' });
    expect(config.localString).toBe('New String');

    let config2 = new SampleConfig();
    expect(config2.localString).toBe('New String');
  });

  it('Persists session storage', () => {
    let config = new SampleConfig();
    config.writeToStorage({ sessionNumber: 12 });
    expect(config.sessionNumber).toBe(12);

    let config2 = new SampleConfig();
    expect(config2.sessionNumber).toBe(12);
  });

  it('Throws an exception if writing to non-persistent value', () => {
    let config = new SampleConfig();
    expect(() => config.writeToStorage({ noneBoolean: false })).toThrowError();
  });

  it('Throws an exception if writing to a non-existent value', () => {
    let config = new SampleConfig();
    expect(() => config.writeToStorage({ foo: true })).toThrowError();
  });

});
