// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Task } from '../dotnet';
import { TaskScheduler, Runtime } from '../js';

self.onmessage = async ev => {
  if (ev.data.command === 'UnitTest') {
    switch (ev.data.testCase) {
      case 'Runtime':
        (self as any).postMessage({
          command: 'RuntimeUnitTest',
          value: [ Runtime.isInNode, Runtime.isInWebWorker, Runtime.isInWindow ]
        });
        break;

      case 'TaskScheduler':
        // Based on the "Execute tasks in priority order" unit test in /src/js/__tests__/TaskScheduler.test.ts
        let n = 100;
  
        // Enqueue a low priority task
        TaskScheduler.schedule(() => n *= 2, 1);
  
        // Enqueue a high priority task
        TaskScheduler.schedule(() => n++, 0);
  
        // Give the tasks time to execute
        await Task.delayAsync(100);
  
        // Following priority, increment before multiply. Should yield 202.
        //
        // Keep TypeScript happy by casting the global scope to any. Unfortunately, TypeScript doesn't support this
        // dual-mode of the same code running as a web worker and the client itself.
        (self as any).postMessage({
          command: 'UnitTest',
          value: n
        });
        break;

      default:
        console.log('Unknown test case', ev.data.testCase);
    }
  }
};
