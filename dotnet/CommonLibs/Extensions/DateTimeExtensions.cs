using System;

namespace WhiteboardServer.Common.Extensions
{
    /// <summary>
    /// Extensions to the <see cref="DateTime"/> class
    /// </summary>
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Returns the value in UNIX time (seconds since 1970)
        /// </summary>
        /// <param name="timestamp">DateTime object</param>
        /// <returns>Number of seconds elapsed since January 1, 1970</returns>
        public static long ToUnixTime(this DateTime timestamp)
        {
            return (long)(timestamp.ToUniversalTime().Subtract(UnixStart)).TotalSeconds;
        }

        /// <summary>
        /// Returns a <see cref="DateTime"/> from a UNIX timestamp
        /// </summary>
        /// <param name="timestamp">UNIX timestamp (seconds since 1970)</param>
        /// <returns>DateTime, in UTC</returns>
        public static DateTime FromUnixTime(long timestamp)
        {
            return UnixStart.AddSeconds(timestamp);
        }

        private static readonly DateTime UnixStart = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
    }   
}
