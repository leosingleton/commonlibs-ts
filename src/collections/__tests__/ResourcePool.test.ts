// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { ResourcePool, RetentionStrategy } from '../ResourcePool';
import { IDisposable } from '../../dotnet';

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

describe('ResourcePool', () => {

  it('Implements the always dispose strategy', () => {
    let pool = new ResourcePool<SampleObject>(RetentionStrategy.AlwaysDispose, 0, 3);

    let o1 = pool.get('a', () => new SampleObject(1));
    expect(o1.value).toBe(1);
    o1.dispose();
    expect(o1.value).toBe(-1);

    let o2 = pool.get('a', () => new SampleObject(2));
    expect(o2.value).toBe(2);

    let o3 = pool.get('a', () => new SampleObject(3));
    expect(o3.value).toBe(3);
    o3.dispose();
    expect(o3.value).toBe(-1);

    pool.dispose();
    expect(o2.value).toBe(2);
    o2.dispose();
    expect(o2.value).toBe(-1);
  });

  it('Implements the always keep strategy', () => {
    let pool = new ResourcePool<SampleObject>(RetentionStrategy.AlwaysKeep, 0, 3);

    let o1 = pool.get('a', () => new SampleObject(1));
    expect(o1.value).toBe(1);
    o1.dispose();
    expect(o1.value).toBe(1); // Returned to pool; not yet disposed

    let o2 = pool.get('a', () => new SampleObject(2));
    expect(o1).toEqual(o2);   // Reused object from pool

    let o3 = pool.get('a', () => new SampleObject(3));
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

});
