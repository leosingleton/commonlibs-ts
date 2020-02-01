// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { IDisposable, using, usingAsync, makeDisposable } from '../Disposable';
import { Task } from '../Task';

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

  it('Nested using() works correctly', () => {
    const c1 = new MyClass();
    const c2 = new MyClass();
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

  it('usingAsync() calls dispose()', async () => {
    const c = new MyClass();
    expect(c.isDisposed).toBeFalsy();

    await usingAsync(c, async cx => {
      expect(c.isDisposed).toBeFalsy();
      await Task.delayAsync(100);
      expect(c.isDisposed).toBeFalsy();
    });

    expect(c.isDisposed).toBeTruthy();
  });

  it('makeDisposable() converts an existing object to IDisposable', () => {
    class MyNonDisposableClass {
      public close(): void {
        this.isClosed = true;
      }

      public isClosed = false;
    }

    const c = makeDisposable(new MyNonDisposableClass(), obj => obj.close());
    expect(c.isClosed).toBeFalsy();
    c.dispose();
    expect(c.isClosed).toBeTruthy();
  });

  it('Ignores null and undefined', () => {
    using(null, () => {
      using(undefined, () => {
        expect(true).toBeTruthy();
      });
    });
  });

  it('Async ignores null and undefined', async() => {
    await usingAsync(null, async () => {
      await usingAsync (undefined, async () => {
        expect(true).toBeTruthy();
      });
    });
  });

});
