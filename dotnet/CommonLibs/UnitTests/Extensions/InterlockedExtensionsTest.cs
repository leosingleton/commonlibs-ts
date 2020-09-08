using Xunit;
using WhiteboardServer.Common.Extensions;

namespace WhiteboardServer.UnitTests.Common.Extensions
{
    public class InterlockedExtensionsTest
    {
        /// <summary>
        /// Tests the <see cref="InterlockedExtensions.And"/> method
        /// </summary>
        [Fact]
        public void InterlockedAnd()
        {
            // 32-bit test
            int value1 = 0x11023304;
            int result1 = InterlockedExtensions.And(ref value1, 0x10203040);
            Assert.Equal(0x10003000, value1);
            Assert.Equal(0x10003000, result1);

            // 64-bit test
            long value2 = 0x1102330455067708;
            long result2 = InterlockedExtensions.And(ref value2, 0x1020304050607080);
            Assert.Equal(0x1000300050007000, value2);
            Assert.Equal(0x1000300050007000, result2);
        }

        /// <summary>
        /// Tests the <see cref="InterlockedExtensions.Or"/> method
        /// </summary>
        [Fact]
        public void InterlockedOr()
        {
            // 32-bit test
            int value1 = 0x01020304;
            int result1 = InterlockedExtensions.Or(ref value1, 0x10203040);
            Assert.Equal(0x11223344, value1);
            Assert.Equal(0x11223344, result1);

            // 64-bit test
            long value2 = 0x0102030405060708;
            long result2 = InterlockedExtensions.Or(ref value2, 0x1020304050607080);
            Assert.Equal(0x1122334455667788, value2);
            Assert.Equal(0x1122334455667788, result2);
        }
    }
}
