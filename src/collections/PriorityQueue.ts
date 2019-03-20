// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Queue } from '../dotnet/Queue';

/**
 * Priority Queue
 */
export class PriorityQueue<T> {
  /**
   * Enqueues an item in the priority queue
   * @param item Item to enqueue
   * @param priority Priority, expressed as an integer, where 0 is the highest value
   */
  public enqueue(item: T, priority: number): void {
    let queue = this._queues[priority];
    if (!queue) {
      queue = new Queue<T>();
      this._queues[priority] = queue;
    }

    queue.enqueue(item);

    this._highestPriority = Math.min(this._highestPriority, priority);
    this._count++;
  }

  /**
   * Gets the next item from the queue
   * @returns Next item in the queue or null if none remain
   */
  public dequeue(): T {
    let priority = this._highestPriority;

    while (priority < this._queues.length) {
      let queue = this._queues[priority];
      if (queue) {
        let item: T;
        if (item = queue.dequeue()) {
          this._count--;
          return item;
        } else {
          // There are no more messages at this priority level
          this._highestPriority++;
        }
      }

      // No messages with data ready at this priority level. Try the next.
      priority++;
    }

    // No items remaining
    return null;
  }

  /**
   * Returns the number of elements in the queue
   */
  public getCount(): number {
    return this._count;
  }

  /**
   * Returns true if the queue is empty
   */
  public isEmpty(): boolean {
    return this._count === 0;
  }

  /**
   * The queues. Indexed by priority, where 0 = highest priority. Not all priority levels are used, so
   * priority level is initialized on first use.
   */
  private _queues: Queue<T>[] = [];

  /**
   * Highest priority level that currently has a message queued
   */
  private _highestPriority = 0;

  /**
   * Number of elements in the queue
   */
  private _count = 0;
}
