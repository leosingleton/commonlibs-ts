// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { AsyncEventWaitHandle } from '../AsyncEventWaitHandle';
import { AsyncManualResetEvent } from '../AsyncManualResetEvent';
import { AsyncAutoResetEvent } from '../AsyncAutoResetEvent';
import { Task } from '../../dotnet/Task';

let _wokenCount = 0;

function createWaitTask(e: AsyncEventWaitHandle) {
  setTimeout(async () => {
    await e.waitAsync();
    _wokenCount++;
  });
}

describe('AsyncEventWaitHandle', () => {

  it('Ensures an AsyncManualResetEvent sets and resets', async () => {
    _wokenCount = 0;
    const e = new AsyncManualResetEvent(false);

    createWaitTask(e);
    await Task.delayAsync(10);
    expect(_wokenCount).toEqual(0);

    e.setEvent();
    createWaitTask(e);
    await Task.delayAsync(10);
    expect(_wokenCount).toEqual(2);

    e.resetEvent();
    createWaitTask(e);
    await Task.delayAsync(10);
    expect(_wokenCount).toEqual(2);
  });

  it('Ensures an AsyncAutoResetEvent sets and resets', async () => {
    _wokenCount = 0;
    const e = new AsyncAutoResetEvent(false);

    createWaitTask(e);
    await Task.delayAsync(10);
    expect(_wokenCount).toEqual(0);

    e.setEvent();
    createWaitTask(e);
    await Task.delayAsync(10);
    expect(_wokenCount).toEqual(1);

    e.setEvent();
    await Task.delayAsync(10);
    expect(_wokenCount).toEqual(2);
  });
});
