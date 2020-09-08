using System.Threading.Tasks;
using WhiteboardServer.Common.Coordination;
using Xunit;

namespace WhiteboardServer.UnitTests.Common.Coordination
{
    public class AsyncTimerEventTest
    {
        /// <summary>
        /// Tests the timer without repeat enabled
        /// </summary>
        [Fact]
        public async Task SingleFire()
        {
            var timer = new AsyncTimerEvent(1000);
            bool hasFired = false;
            var unused = Task.Run(async () =>
            {
                await timer.WaitAsync();
                hasFired = true;
            });

            await Task.Delay(900);
            Assert.False(hasFired);

            await Task.Delay(200);
            Assert.True(hasFired);
        }

        /// <summary>
        /// Tests the timer with repeat enabled
        /// </summary>
        [Fact]
        public async Task MultipleFire()
        {
            var timer = new AsyncTimerEvent(100, true);
            int fireCount = 0;
            var unused = Task.Run(async () =>
            {
                while (fireCount < 12)
                {
                    await timer.WaitAsync();
                    fireCount++;
                }
            });

            await Task.Delay(1000);
            Assert.InRange(fireCount, 8, 12);
            await Task.Delay(500);
        }
    }
}
