import { DisposableSet } from '../DisposableSet';
import { IDisposable, using } from '../../dotnet/Disposable';

let disposeCount = 0;

class MyClass implements IDisposable {
  public dispose(): void {
    disposeCount++;
  }
}

describe('DisposableSet', () => {

  it('disposes all objects', () => {
    using(new DisposableSet(), set => {
      set.addObject(new MyClass());
      set.addObject(new MyClass());
      let obj = set.addObject(new MyClass());

      // Nothing has been disposed yet
      expect(disposeCount).toEqual(0);

      // Force early dispose of one object
      set.disposeObject(obj);
      expect(disposeCount).toEqual(1);
    });

    // At the end of the using block, all objects are disposed
    expect(disposeCount).toEqual(3);
  });

});
