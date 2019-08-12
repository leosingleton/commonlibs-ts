// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { CircularBuffer } from './CircularBuffer';
import { IDisposable } from '../dotnet';

export const enum RetentionStrategy {
  AlwaysDispose,
  KeepMinimum,
  KeepMaximum,
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
      case RetentionStrategy.KeepMinimum:   return Math.max(this.inUseHistorical.min(), this.inUseMaximum);
      case RetentionStrategy.KeepMaximum:   return Math.max(this.inUseHistorical.max(), this.inUseMaximum);
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
    this.inUseHistorical.push(this.inUseMaximum);
    this.inUseMaximum = this.inUseCurrent;

    let objs = this.objects;
    let target = this.getTargetObjectCount();    
    while (objs.length > 0 && this.inUseCurrent + objs.length > target) {
      let obj = objs.pop();
      obj.realDispose();
    }
  }
}

export abstract class ResourcePool<T extends IDisposable> implements IDisposable {
  protected constructor(strategy = RetentionStrategy.KeepMinimum, groomingInterval = 5000, groomingPeriods = 6) {
    this.strategy = strategy;
    this.groomingInterval = groomingInterval;
    this.groomingPeriods = groomingPeriods;

    if ((strategy === RetentionStrategy.KeepMinimum || strategy === RetentionStrategy.KeepMaximum) &&
        groomingInterval > 0) {
      setTimeout(() => this.groom(), this.groomingInterval);
    }
  }

  protected readonly strategy: RetentionStrategy;
  protected readonly groomingInterval: number;
  protected readonly groomingPeriods: number;

  public dispose(): void {
    let ids = Object.keys(this.pools);
    ids.forEach(id => {
      this.pools[id].dispose();
    });
    this.pools = {};
  }

  protected get(id: string, create: () => T): T {
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

  protected groom(): void {
    let ids = Object.keys(this.pools);
    ids.forEach(id => {
      this.pools[id].groom();
    });

    if (this.groomingInterval > 0) {
      setTimeout(() => this.groom(), this.groomingInterval);
    }
  }

  private pools: { [id: string]: Pool<T> } = {};
}
