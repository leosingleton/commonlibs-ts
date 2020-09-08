using System.Threading;
using System.Threading.Tasks;

namespace WhiteboardServer.Common.Coordination
{
    /// <summary>
    /// Mutex built for .NET's async pattern
    /// </summary>
    public class AsyncMutex
    {
        /// <summary>
        /// Boolean set to true when the mutex is locked
        /// </summary>
        /// <remarks>
        /// An integer is used for atomic operations. 0 == false. 1 == true.
        /// </remarks>
        private int _IsLocked = 0;

        /// <summary>
        /// Event signalled whenever the mutex is unlocked
        /// </summary>
        private AsyncAutoResetEvent _UnlockedEvent = new AsyncAutoResetEvent();

        /// <summary>
        /// Acquires the mutex. Blocks until the lock is acquired.
        /// </summary>
        public async Task Lock()
        {
            while (Interlocked.CompareExchange(ref _IsLocked, 1, 0) != 0)
            {
                await _UnlockedEvent.WaitAsync();
            }
        }

        /// <summary>
        /// Releases the mutex.
        /// </summary>
        public void Unlock()
        {
            _IsLocked = 0;
            _UnlockedEvent.Set();
        }
    }
}
