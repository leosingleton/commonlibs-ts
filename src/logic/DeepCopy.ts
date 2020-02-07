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

/**
 * Performs a deep comparison of two objects
 * @param obj1 First object to compare
 * @param obj2 Second object to compare
 * @returns True if equal; false otherwise
 */
export function deepEquals<T>(obj1: T, obj2: T): boolean {
  // Most efficient according to:
  // https://www.mattzeunert.com/2016/01/28/javascript-deep-equal.html
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
