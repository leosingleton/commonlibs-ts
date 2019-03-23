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

/**
 * Helper function for C#-like using blocks when using async code
 * @param obj Object to dispose at the end of the lambda execution
 * @param lambda Async lambda function to execute. The object is passed as a parameter to allow new objects to be
 *    created in a single line of code, i.e. await usingAsync(new MyObject(), async obj => { /* Use obj *\/ });
 */
export async function usingAsync<T extends IDisposable>(obj: T, lambda: (obj: T) => Promise<void>): Promise<void> {
  try {
    await lambda(obj);
  } finally {
    obj.dispose();
  }
}
