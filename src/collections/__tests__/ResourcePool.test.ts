// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { ResourcePool, RetentionStrategy } from '../ResourcePool';
import { IDisposable } from '../../dotnet';

/** Sample object for unit tests */
class SampleObject implements IDisposable {
  public constructor(value: number) {
    this.value = value;
  }

  public value: number;

  public dispose(): void {
    if (this.value === -1) {
      throw new Error('Double dispose')
    } else {
      this.value = -1;
    }
  }
}

/** Just for unit tests. Exposes the grooming timer so we can call it without waiting. */
class SampleResourcePool extends ResourcePool<SampleObject> {
  public constructor(strategy: RetentionStrategy) {
    super(strategy, 0, 3);
  }

  public getObject(value: number): SampleObject {
    return this.getOrCreate('', () => new SampleObject(value));
  }

  public simulateGroomingInterval(): void {
    this.groom();
  }
}

describe('ResourcePool', () => {

  it('Implements the always dispose strategy', () => {
    let pool = new SampleResourcePool(RetentionStrategy.AlwaysDispose);

    let o1 = pool.getObject(1);
    expect(o1.value).toBe(1);
    o1.dispose();
    expect(o1.value).toBe(-1);

    let o2 = pool.getObject(2);
    expect(o2.value).toBe(2); // New object is created every time

    let o3 = pool.getObject(3);
    expect(o3.value).toBe(3); // New object is created every time
    o3.dispose();
    expect(o3.value).toBe(-1);

    pool.dispose();
    expect(o2.value).toBe(2);
    o2.dispose();
    expect(o2.value).toBe(-1);
  });

  it('Implements the always keep strategy', () => {
    let pool = new SampleResourcePool(RetentionStrategy.AlwaysKeep);

    let o1 = pool.getObject(1);
    expect(o1.value).toBe(1);
    o1.dispose();
    expect(o1.value).toBe(1); // Returned to pool; not yet disposed

    let o2 = pool.getObject(2);
    expect(o1).toEqual(o2);   // Reused object from pool

    let o3 = pool.getObject(3);
    expect(o3.value).toBe(3); // Pool was empty; allocated new
    o3.dispose();
    expect(o3.value).toBe(3); // Returned to pool; not yet disposed

    pool.dispose();
    expect(o1.value).toBe(1);
    expect(o2.value).toBe(1);
    expect(o3.value).toBe(-1);
    o2.dispose();
    expect(o1.value).toBe(-1);
    expect(o2.value).toBe(-1);
  });

  it('Implements the keep minimum dispose strategy', () => {
    let pool = new SampleResourcePool(RetentionStrategy.KeepMinimum);

    let o1 = pool.getObject(1);
    expect(o1.value).toBe(1);
    o1.dispose();
    expect(o1.value).toBe(1); // Returned to pool; not yet disposed

    let o2 = pool.getObject(2);
    expect(o1).toEqual(o2);   // Reused object from pool

    let o3 = pool.getObject(3);
    expect(o3.value).toBe(3); // Pool was empty; allocated new
    o3.dispose();
    expect(o3.value).toBe(3); // Returned to pool; not yet disposed

    pool.simulateGroomingInterval();
    expect(o3.value).toBe(3); // In the previous period, 2 objects were used at the same time. So minimum === 2.

    pool.simulateGroomingInterval();
    expect(o3.value).toBe(-1);// In the last period, only 1 object was used, so the minimum === 1. Extra is disposed.
    pool.simulateGroomingInterval();
    expect(o3.value).toBe(-1);
    pool.simulateGroomingInterval();
    expect(o3.value).toBe(-1);

    o2.dispose();
    expect(o2.value).toBe(1); // Returned to pool; not yet disposed

    pool.dispose();
    expect(o2.value).toBe(-1);
  });

});