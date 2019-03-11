// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/**
 * Performs a deep copy of an object
 * @param obj Object to copy
 */
export function deepCopy<T>(obj: T): T {
  // Most efficient according to:
  // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
  return JSON.parse(JSON.stringify(obj));
}
