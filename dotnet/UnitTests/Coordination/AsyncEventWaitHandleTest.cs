// LeoSingleton.CommonLibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace LeoSingleton.CommonLibs.Coordination.UnitTests
{
    public class AsyncEventWaitHandleTest
    {
        private int _WokenCount = 0;

        private void CreateWaitTask(AsyncEventWaitHandle e)
        {
            var task = Task.Run(async () =>
            {
                await e.WaitAsync();
                Interlocked.Increment(ref _WokenCount);
            });
        }

        /// <summary>
        /// Ensures an AsyncManualResetEvent sets and resets
        /// </summary>
        [Fact]
        public async Task ManualResetEventAsync()
        {
            _WokenCount = 0;
            var e = new AsyncManualResetEvent(false);

            CreateWaitTask(e);
            await Task.Delay(10);
            Assert.Equal(0, _WokenCount);

            e.Set();
            CreateWaitTask(e);
            await Task.Delay(10);
            Assert.Equal(2, _WokenCount);

            e.Reset();
            CreateWaitTask(e);
            await Task.Delay(10);
            Assert.Equal(2, _WokenCount);
        }

        /// <summary>
        /// Ensures an AsyncAutoResetEvent sets and resets
        /// </summary>
        [Fact]
        public async Task AutoResetEventAsync()
        {
            _WokenCount = 0;
            var e = new AsyncAutoResetEvent(false);

            CreateWaitTask(e);
            await Task.Delay(10);
            Assert.Equal(0, _WokenCount);

            e.Set();
            CreateWaitTask(e);
            await Task.Delay(10);
            Assert.Equal(1, _WokenCount);

            e.Set();
            await Task.Delay(10);
            Assert.Equal(2, _WokenCount);
        }
    }
}
