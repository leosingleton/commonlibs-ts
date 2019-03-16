// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { IDisposable, using } from '../Disposable';

class MyClass implements IDisposable {
  public dispose(): void {
    this.isDisposed = true;
  }

  public isDisposed = false;
}

describe('Disposable', () => {

  it('using() calls dispose()', () => {
    let c2: MyClass;

    using(new MyClass(), c1 => {
      expect(c1.isDisposed).toBeFalsy();
      c2 = c1;
    });

    expect(c2.isDisposed).toBeTruthy();
  });

  it('using() handles exceptions correctly', () => {
    let c2: MyClass;

    expect(() => {
      using (new MyClass(), c1 => {
        expect(c1.isDisposed).toBeFalsy();
        c2 = c1;
        throw new Error();
      });
    }).toThrow();
    
    expect(c2.isDisposed).toBeTruthy();
  });

  it('Nesed using() works correctly', () => {
    let c1 = new MyClass();
    let c2 = new MyClass();
    expect(c1.isDisposed).toBeFalsy();
    expect(c2.isDisposed).toBeFalsy();

    using (c1, c1x => {
      using (c2, c2x => {
        expect(c1.isDisposed).toBeFalsy();
        expect(c2.isDisposed).toBeFalsy();
      });

      expect(c1.isDisposed).toBeFalsy();
      expect(c2.isDisposed).toBeTruthy();
    });

    expect(c1.isDisposed).toBeTruthy();
    expect(c2.isDisposed).toBeTruthy();
  });

});