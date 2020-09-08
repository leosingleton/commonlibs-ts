// LeoSingleton.CommonLibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace LeoSingleton.CommonLibs.Coordination.UnitTests
{
    public class AsyncMutexTest
    {
        /// <summary>
        /// Ensures <see cref="AsyncMutex"/> performs mutual exclusions
        /// </summary>
        [Fact]
        public async Task MutualExclusion()
        {
            int sharedValue = 0;
            var mutex = new AsyncMutex();
            var hundredEvent = new AsyncManualResetEvent();

            // Create 10 threads that increment a value 10 times each
            for (int n = 0; n < 10; n++)
            {
                new Thread(async () =>
                {
                    await mutex.Lock();

                    int privateValue = sharedValue;
                    for (int m = 0; m < 10; m++)
                    {
                        // If the mutex works, no other thread will increment sharedValue
                        sharedValue++;
                        privateValue++;
                        Assert.Equal(privateValue, sharedValue);

                        if (sharedValue == 100)
                        {
                            // The test case is complete
                            hundredEvent.Set();
                        }

                        // Yield the CPU to give other threads a chance to run
                        await Task.Delay(10);
                    }

                    mutex.Unlock();
                }).Start();
            }

            await hundredEvent.WaitAsync();
            Assert.Equal(100, sharedValue);
        }
    }
}
