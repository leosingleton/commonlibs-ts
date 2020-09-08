// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { ConfigurationOptions, ConfigurationFlags, StorageType } from '../ConfigurationOptions';

/** Sample class demonstrating the use of ConfigurationOptions */
export class SampleConfig extends ConfigurationOptions {
  public constructor() {
    super('test_', ConfigurationFlags.AllowNonBrowsers);
    this.initializeValues();
  }

  /** A string setting persisted in local storage */
  public readonly localString: string;

  /** A numeric setting persisted in session storage */
  public readonly sessionNumber: number;

  /** A boolean setting not persisted */
  public readonly noneBoolean: boolean;

  protected defaults: {[id: string]: [string, StorageType, any]} = {
    localString: ['str', StorageType.Local, 'Hello'],
    sessionNumber: ['num', StorageType.Session, 42],
    noneBoolean: ['bool', StorageType.None, true]
  };
}
