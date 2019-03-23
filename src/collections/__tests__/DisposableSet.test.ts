// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { DisposableSet } from '../DisposableSet';
import { IDisposable } from '../../dotnet/Disposable';

let disposeCount = 0;

class MyClass implements IDisposable {
  public dispose(): void {
    disposeCount++;
  }
}

class MyClass2 {
  public close(): void {
    disposeCount++;
  }
}

describe('DisposableSet', () => {

  it('disposes all objects', () => {
    DisposableSet.using(set => {
      set.addDisposable(new MyClass());
      set.addDisposable(new MyClass());
      set.addNonDisposable(new MyClass2(), obj => obj.close());      
      let obj = set.addDisposable(new MyClass());

      // Nothing has been disposed yet
      expect(disposeCount).toEqual(0);

      // Force early dispose of one object
      set.disposeObject(obj);
      expect(disposeCount).toEqual(1);
    });

    // At the end of the using block, all objects are disposed
    expect(disposeCount).toEqual(4);
  });

});
