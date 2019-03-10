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

  it('using() handles execeptions correctly', () => {
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

});
