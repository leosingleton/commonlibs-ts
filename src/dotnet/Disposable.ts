// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/** C#-like pattern for objects that hold expensive resources that must be explicitly freed */
export interface IDisposable {
  /** Frees resources */
  dispose(): void;
}

/**
 * Helper function for C#-like using blocks
 * @param obj Object to dispose at the end of the lambda execution
 * @param lambda Lambda function to execute. The object is passed as a parameter to allow new objects to be created in
 *    a single line of code, i.e. using(new MyObject(), obj => { /* Use obj *\/ });
 */
export function using<T extends IDisposable>(obj: T, lambda: (obj: T) => void): void {
  try {
    lambda(obj);
  } finally {
    obj.dispose();
  }
}
