using WhiteboardServer.Common;
using Xunit;

namespace WhiteboardServer.UnitTests.Common
{
    /// <summary>
    /// Tests the <see cref="VersionComparer"/> class
    /// </summary>
    public class VersionComparerTest
    {
        /// <summary>
        /// 2.0 &gt; 1.1
        /// </summary>
        [Fact]
        public void MajorGreaterMinor()
        {
            var v1 = new ushort[] { 2, 0 };
            var v2 = new ushort[] { 1, 1 };
            Assert.Equal(v2, VersionComparer.Lower(v1, v2));
        }

        /// <summary>
        /// 1.0 &lt; 1.1
        /// </summary>
        [Fact]
        public void MajorEqualMinorLess()
        {
            var v1 = new ushort[] { 1, 0 };
            var v2 = new ushort[] { 1, 1 };
            Assert.Equal(v1, VersionComparer.Lower(v1, v2));
        }

        /// <summary>
        /// 3.4 == 3.4
        /// </summary>
        [Fact]
        public void MajorMinorEqual()
        {
            var v1 = new ushort[] { 3, 4 };
            var v2 = new ushort[] { 3, 4 };
            Assert.Equal(v1, VersionComparer.Lower(v1, v2));
        }

        /// <summary>
        /// 1.1.4 &lt; 2.0.0
        /// </summary>
        [Fact]
        public void MajorLessMinorPatch()
        {
            var v1 = new ushort[] { 1, 1, 4 };
            var v2 = new ushort[] { 2, 0, 0 };
            Assert.Equal(v1, VersionComparer.Lower(v1, v2));
        }

        /// <summary>
        /// 2.4.0 &gt; 2.2.6
        /// </summary>
        [Fact]
        public void MajorEqualMinorGreaterPatch()
        {
            var v1 = new ushort[] { 2, 4, 0 };
            var v2 = new ushort[] { 2, 2, 6 };
            Assert.Equal(v2, VersionComparer.Lower(v1, v2));
        }

        /// <summary>
        /// 3.4.2 == 3.4.2
        /// </summary>
        [Fact]
        public void MajorMinorPatchEqual()
        {
            var v1 = new ushort[] { 3, 4, 2 };
            var v2 = new ushort[] { 3, 4, 2 };
            Assert.Equal(v1, VersionComparer.Lower(v1, v2));
        }
    }
}
