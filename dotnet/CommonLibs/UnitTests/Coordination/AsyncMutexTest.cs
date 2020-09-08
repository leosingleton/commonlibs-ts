using System.Threading;
using System.Threading.Tasks;
using WhiteboardServer.Common.Coordination;
using Xunit;

namespace WhiteboardServer.UnitTests.Common.Coordination
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
