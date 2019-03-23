// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { IDisposable, makeDisposable, using, usingAsync } from '../dotnet/Disposable';

/**
 * Collection of disposable objects which allows cleanup with a single call to dispose() or using() block
 */
export class DisposableSet implements IDisposable {
  private members: IDisposable[] = [];

  public dispose(): void {
    this.members.forEach(obj => obj.dispose());
    this.members = [];
  }

  /**
   * Adds an IDisposable object to the set
   * @param obj Object to add
   */
  public addDisposable<T extends IDisposable>(obj: T): T {
    this.members.push(obj);
    return obj;
  }

  /**
   * Prematurely removes and disposes an object from the set that was added with either addDisposable() or
   * addNonDisposable()
   * @param obj Object to remove and dispose
   */
  public disposeObject(obj: IDisposable): void {
    let index = this.members.indexOf(obj);
    if (index > -1) {
      this.members.splice(index, 1);
    }

    obj.dispose();
  }

  /**
   * Many objects in JavaScript have a disposable-like pattern, but there is no standard dispose() method nor IDisposable
   * interface. Some use .close(), while others use .restore(). This wrapper makes it easy to convert existing objects,
   * e.g. let obj = set.addNonDisposable(imageBitmap, obj => obj.close())
   * @param obj Object to make IDisposable
   * @param dispose Lambda to execute to dispose the object
   * @returns A reference to the object provided, to allow for one-line declarations
   */
  public addNonDisposable<T>(obj: T, dispose: (obj: T) => void): T & IDisposable {
    return this.addDisposable(makeDisposable(obj, dispose));
  }

  /**
   * Helper function to create a DisposableSet in a using() block
   * @param lambda Contents of the using() block
   */
  public static using(lambda: (set: DisposableSet) => void): void {
    using(new DisposableSet(), lambda);
  }

  /**
   * Helper function to create a DisposableSet in a usingAsync() block
   * @param lambda Contents of the usingAsync() block
   */
  public static usingAsync(lambda: (set: DisposableSet) => Promise<void>): Promise<void> {
    return usingAsync(new DisposableSet(), lambda);
  }
}
