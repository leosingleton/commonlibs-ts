using System.Threading;

namespace WhiteboardServer.Common.Extensions
{
    /// <summary>
    /// Extensions to the <see cref="Interlocked"/> class
    /// </summary>
    public static class InterlockedExtensions
    {
        /// <summary>
        /// Performs a bitwise AND on two 32-bit integers and replaces the first integer as an atomic operation
        /// </summary>
        /// <param name="location1">
        /// A reference to the first operand. This value will be replaced with the result of the operation.
        /// </param>
        /// <param name="value">The second operand.</param>
        /// <returns>The new value stored at location1.</returns>
        public static int And(ref int location1, int value)
        {
            int newValue, oldValue;

            do
            {
                oldValue = location1;
                newValue = oldValue & value;
            } while (Interlocked.CompareExchange(ref location1, newValue, oldValue) != oldValue);

            return newValue;
        }

        /// <summary>
        /// Performs a bitwise AND on two 64-bit integers and replaces the first integer as an atomic operation
        /// </summary>
        /// <param name="location1">
        /// A reference to the first operand. This value will be replaced with the result of the operation.
        /// </param>
        /// <param name="value">The second operand.</param>
        /// <returns>The new value stored at location1.</returns>
        public static long And(ref long location1, long value)
        {
            long newValue, oldValue;

            do
            {
                oldValue = Interlocked.Read(ref location1);
                newValue = oldValue & value;
            } while (Interlocked.CompareExchange(ref location1, newValue, oldValue) != oldValue);

            return newValue;
        }

        /// <summary>
        /// Performs a bitwise OR on two 32-bit integers and replaces the first integer as an atomic operation
        /// </summary>
        /// <param name="location1">
        /// A reference to the first operand. This value will be replaced with the result of the operation.
        /// </param>
        /// <param name="value">The second operand.</param>
        /// <returns>The new value stored at location1.</returns>
        public static int Or(ref int location1, int value)
        {
            int newValue, oldValue;

            do
            {
                oldValue = location1;
                newValue = oldValue | value;
            } while (Interlocked.CompareExchange(ref location1, newValue, oldValue) != oldValue);

            return newValue;
        }

        /// <summary>
        /// Performs a bitwise OR on two 64-bit integers and replaces the first integer as an atomic operation
        /// </summary>
        /// <param name="location1">
        /// A reference to the first operand. This value will be replaced with the result of the operation.
        /// </param>
        /// <param name="value">The second operand.</param>
        /// <returns>The new value stored at location1.</returns>
        public static long Or(ref long location1, long value)
        {
            long newValue, oldValue;

            do
            {
                oldValue = Interlocked.Read(ref location1);
                newValue = oldValue | value;
            } while (Interlocked.CompareExchange(ref location1, newValue, oldValue) != oldValue);

            return newValue;
        }
    }
}
