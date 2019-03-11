// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { IDisposable } from '../dotnet/Disposable';

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
}
