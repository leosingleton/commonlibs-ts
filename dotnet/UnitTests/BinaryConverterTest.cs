using WhiteboardServer.Common;
using Xunit;

namespace WhiteboardServer.UnitTests.Common
{
    /// <summary>
    /// Tests the <see cref="BinaryConverter"/> class
    /// </summary>
    public class BinaryConverterTest
    {
        [Fact]
        public void UInt64()
        {
            var buffer = new byte[9];

            BinaryConverter.Write(buffer, 1, ulong.MinValue);
            var value1 = BinaryConverter.ReadUInt64(buffer, 1);
            Assert.Equal(ulong.MinValue, value1);

            BinaryConverter.Write(buffer, 1, ulong.MaxValue);
            var value2 = BinaryConverter.ReadUInt64(buffer, 1);
            Assert.Equal(ulong.MaxValue, value2);
        }

        [Fact]
        public void Int32()
        {
            var buffer = new byte[5];

            BinaryConverter.Write(buffer, 1, 0);
            var value1 = BinaryConverter.ReadInt32(buffer, 1);
            Assert.Equal(0, value1);

            BinaryConverter.Write(buffer, 1, int.MinValue);
            var value2 = BinaryConverter.ReadInt32(buffer, 1);
            Assert.Equal(int.MinValue, value2);

            BinaryConverter.Write(buffer, 1, int.MaxValue);
            var value3 = BinaryConverter.ReadInt32(buffer, 1);
            Assert.Equal(int.MaxValue, value3);
        }

        [Fact]
        public void UInt16()
        {
            var buffer = new byte[3];

            BinaryConverter.Write(buffer, 1, ushort.MinValue);
            var value1 = BinaryConverter.ReadUInt16(buffer, 1);
            Assert.Equal(ushort.MinValue, value1);

            BinaryConverter.Write(buffer, 1, ushort.MaxValue);
            var value2 = BinaryConverter.ReadUInt16(buffer, 1);
            Assert.Equal(ushort.MaxValue, value2);
        }

        [Fact]
        public void Int16()
        {
            var buffer = new byte[3];

            BinaryConverter.Write(buffer, 1, (short)0);
            var value1 = BinaryConverter.ReadInt16(buffer, 1);
            Assert.Equal(0, value1);

            BinaryConverter.Write(buffer, 1, short.MinValue);
            var value2 = BinaryConverter.ReadInt16(buffer, 1);
            Assert.Equal(short.MinValue, value2);

            BinaryConverter.Write(buffer, 1, short.MaxValue);
            var value3 = BinaryConverter.ReadInt16(buffer, 1);
            Assert.Equal(short.MaxValue, value3);
        }
    }
}
