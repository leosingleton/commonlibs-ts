// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

console.log('Hello from WebWorker');

self.onmessage = async ev => {
  switch (ev.data) {
    case 'TaskScheduler':
      // Keep TypeScript happy by casting the global scope to any. Unfortunately, TypeScript doesn't support this
      // dual-mode of the same code running as a web worker and the client itself.
      let g = self as any;
      g.postMessage(202);
  }
};

/*
let n = 100;

// Enqueue a low priority task
TaskScheduler.schedule(() => n *= 2, 1);

// Enqueue a high priority task
TaskScheduler.schedule(() => n++, 0);

// Give the tasks time to execute
await Task.delay(100);

// Following priority, increment before multiply. Should yield 202.
postMessage(n);
*/