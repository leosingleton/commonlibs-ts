// LeoSingleton.CommonLibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

using System.Threading.Tasks;

namespace LeoSingleton.CommonLibs.Coordination
{
    /// <summary>
    /// Timer that behaves like an EventWaitHandle. Useful for the
    /// <see cref="AsyncEventWaitHandle.WhenAny(AsyncEventWaitHandle[])"/> method to set a timeout.
    /// </summary>
    public class AsyncTimerEvent : AsyncEventWaitHandle
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="millisecondsDelay">Timer interval, in milliseconds</param>
        /// <param name="repeat">If true, the timer repeats indefinitely; if false, it only occurs once.</param>
        public AsyncTimerEvent(int millisecondsDelay, bool repeat = false) : base(repeat, false)
        {
            var unused = Task.Run(async () =>
            {
                do
                {
                    await Task.Delay(millisecondsDelay).ConfigureAwait(false);
                    Set();
                } while (repeat);
            });
        }
    }
}
