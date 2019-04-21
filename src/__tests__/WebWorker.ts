// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Task } from '../dotnet';
import { TaskScheduler } from '../js';

self.onmessage = async ev => {
  switch (ev.data) {
    case 'TaskScheduler':
      // Based on the "Execute tasks in priority order" unit test in /src/js/__tests__/TaskScheduler.test.ts
      let n = 100;

      // Enqueue a low priority task
      TaskScheduler.schedule(() => n *= 2, 1);

      // Enqueue a high priority task
      TaskScheduler.schedule(() => n++, 0);

      // Give the tasks time to execute
      await Task.delay(100);

      // Following priority, increment before multiply. Should yield 202.
      //
      // Keep TypeScript happy by casting the global scope to any. Unfortunately, TypeScript doesn't support this
      // dual-mode of the same code running as a web worker and the client itself.
      let g = self as any;
      g.postMessage(n);
      break;

    default:
      console.log('Unknown event', ev.data);
  }
};
