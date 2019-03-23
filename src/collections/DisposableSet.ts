// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { IDisposable, makeDisposable } from '../dotnet/Disposable';

/**
 * Collection of disposable objects which allows cleanup with a single call to dispose() or using() block
 */
export class DisposableSet implements IDisposable {
  private members: IDisposable[] = [];

  public dispose(): void {
    this.members.forEach(obj => obj.dispose());
    this.members = [];
  }

  public addObject<T extends IDisposable>(obj: T): T {
    this.members.push(obj);
    return obj;
  }

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
    return this.addObject(makeDisposable(obj, dispose));
  }
}
