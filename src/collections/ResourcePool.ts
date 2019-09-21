// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { CircularBuffer } from './CircularBuffer';
import { IDisposable } from '../dotnet/Disposable';

/** Retention strategies for ResourcePool */
export const enum RetentionStrategy {
  /** Disables resource pooling. Always disposes objects and never saves them for reuse. */
  AlwaysDispose,

  /**
   * Ensures enough objects are kept in the pool to fulfill the peak concurrent use of each type. If the previous
   * periods had varying usage, then the lowest peak of the previous periods is used.
   */
  KeepMinimum,

  /**
   * Ensures enough objects are kept in the pool to fulfill the peak concurrent use of each type. If the previous
   * periods had varying usage, then the highest peak of the previous periods is used.
   */
  KeepMaximum,

  /** Keeps all unused objects in the pool until the pool itself is disposed. */
  AlwaysKeep
}

interface IPooledDisposable extends IDisposable {
  realDispose(): void;
}

function makePooledDisposable<T extends IDisposable>(obj: T, dispose: (obj: T & IPooledDisposable) => void):
    T & IPooledDisposable {
  let newObj = obj as T & IPooledDisposable;
  newObj.realDispose = obj.dispose;
  newObj.dispose = () => dispose(newObj);
  return newObj;
}

class Pool<T extends IDisposable> implements IDisposable {
  public constructor(strategy: RetentionStrategy, historicalPeriods: number) {
    this.isDisposed = false;
    this.strategy = strategy;
    this.objects = [];
    this.inUseCurrent = 0;
    this.inUseMaximum = 0;
    this.inUseHistorical = new CircularBuffer(historicalPeriods);
  }

  private isDisposed: boolean;
  private strategy: RetentionStrategy;
  private objects: (T & IPooledDisposable)[];
  private inUseCurrent: number;
  private inUseMaximum: number;
  private inUseHistorical: CircularBuffer;

  public dispose(): void {
    // Force all outstanding objects to be disposed when they are returned to returnObject()
    this.isDisposed = true;

    let objs = this.objects;
    while (objs.length > 0) {
      let obj = objs.pop();
      obj.realDispose();
    }
  }

  public getTargetObjectCount(): number {
    switch (this.strategy) {
      case RetentionStrategy.AlwaysDispose: return 0;
      case RetentionStrategy.KeepMinimum:   return Math.max(this.inUseHistorical.minValue(), this.inUseMaximum);
      case RetentionStrategy.KeepMaximum:   return Math.max(this.inUseHistorical.maxValue(), this.inUseMaximum);
      case RetentionStrategy.AlwaysKeep:    return Number.MAX_SAFE_INTEGER;
    }
  }

  public getObject(): T {
    let objs = this.objects;
    if (objs.length > 0) {
      // Track the number of objects in use, along with the maximum number of objects used this period
      let current = ++this.inUseCurrent;
      this.inUseMaximum = Math.max(this.inUseMaximum, current);

      return objs.pop();
    }
  }

  public onObjectCreated(obj: T): void {
    // Track the number of objects in use, along with the maximum number of objects used this period
    let current = ++this.inUseCurrent;
    this.inUseMaximum = Math.max(this.inUseMaximum, current);
  }

  public returnObject(obj: T): void {
    let o = obj as T & IPooledDisposable;
    let objs = this.objects;
    let target = this.getTargetObjectCount();

    if (this.isDisposed || this.inUseCurrent + objs.length > target) {
      o.realDispose();
    } else {
      objs.push(o);
    }

    --this.inUseCurrent;
  }

  public groom(): void {
    this.inUseHistorical.pushValue(this.inUseMaximum);
    this.inUseMaximum = this.inUseCurrent;

    let objs = this.objects;
    let target = this.getTargetObjectCount();    
    while (objs.length > 0 && this.inUseCurrent + objs.length > target) {
      let obj = objs.pop();
      obj.realDispose();
    }
  }
}

/**
 * Resource pools are used for objects that are expensive to create and destroy and aims to reuse as many objects as
 * possible. This base class provides functionality for creating a resource pool for a specific object type.
 */
export abstract class ResourcePool<T extends IDisposable> implements IDisposable {
  /**
   * Constructor
   * @param strategy Retention strategy. See the details on the values of the RetentionStrategy enum.
   * @param groomingInterval Grooming interval, in milliseconds. Note that objects are always disposed as soon as the
   *    upper limit is hit--this interval simply controls how often the limit is recalculated, which if lower, will
   *    result in objects being groomed. This value only applies to the KeepMinimum and KeepMaximum strategies.
   * @param groomingPeriods The number of grooming periods to track for historical purposes. This value only applies to
   *    the KeepMinimum and KeepMaximum strategies.
   */
  protected constructor(strategy = RetentionStrategy.KeepMinimum, groomingInterval = 5000, groomingPeriods = 6) {
    this.strategy = strategy;
    this.groomingInterval = groomingInterval;
    this.groomingPeriods = groomingPeriods;

    if ((strategy === RetentionStrategy.KeepMinimum || strategy === RetentionStrategy.KeepMaximum) &&
        groomingInterval > 0) {
      setTimeout(() => this.groom(), this.groomingInterval);
    }
  }

  /** Retention strategy. See the details on the values of the RetentionStrategy enum. */
  protected readonly strategy: RetentionStrategy;

  /**
   * Grooming interval, in milliseconds. Note that objects are always disposed as soon as the upper limit is hit--this
   * interval simply controls how often the limit is recalculated, which if lower, will result in objects being
   * groomed. This value only applies to the KeepMinimum and KeepMaximum strategies.
   */
  protected readonly groomingInterval: number;

  /**
   * The number of grooming periods to track for historical purposes. This value only applies to the KeepMinimum and
   * KeepMaximum strategies.
   */
  protected readonly groomingPeriods: number;

  public dispose(): void {
    let ids = Object.keys(this.pools);
    ids.forEach(id => {
      this.pools[id].dispose();
    });
    this.pools = {};

    // Stop the grooming thread
    this.isDisposed = true;
  }

  /**
   * Gets an object from the pool or creates a new one if there are none available
   * @param id Unique string describing the object creation parameters--only objects with matching IDs will be shared.
   *    The ID format is specific to the object type. For example, an image might have resolution and color depth as
   *    parameters which make up the ID, whereas a socket might have hostname and port.
   * @param create Lambda function to create a new object. This is only invoked if no unused objects in the pool match
   *    the requested ID.
   */
  protected getOrCreateObject(id: string, create: () => T): T {
    let pool = this.pools[id];
    if (!pool) {
      pool = this.pools[id] = new Pool(this.strategy, this.groomingPeriods);
    }

    let obj = pool.getObject();
    if (obj) {
      return obj;
    }

    obj = create();
    pool.onObjectCreated(obj);
    return makePooledDisposable(obj, o2 => pool.returnObject(o2));
  }

  /**
   * Executes grooming. Normally this function is invoked automatically based on the grooming interval specified in the
   * constructor. However, if the grooming interval is set to 0 in the constructor, derived classes may explicitly
   * invoke it to have full control over when grooming runs.
   */
  protected groom(): void {
    let ids = Object.keys(this.pools);
    ids.forEach(id => {
      this.pools[id].groom();
    });

    if (!this.isDisposed && this.groomingInterval > 0) {
      setTimeout(() => this.groom(), this.groomingInterval);
    }
  }

  private pools: { [id: string]: Pool<T> } = {};
  private isDisposed = false;
}
