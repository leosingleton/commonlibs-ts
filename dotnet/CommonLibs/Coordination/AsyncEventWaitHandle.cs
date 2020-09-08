using System.Collections.Generic;
using System.Threading.Tasks;

namespace WhiteboardServer.Common.Coordination
{
    /// <summary>
    /// Async version of <see cref="System.Threading.EventWaitHandle"/>. Based on Stephen Cleary's AsyncEx library,
    /// however we implement our own from scratch because:
    /// <para>
    /// AsyncEx doesn't offer a WaitAny method. Previously, this created a race condition where using the built-in
    /// <see cref="Task.WhenAny(Task[])"/> resulted in deadlock, since the Tasks that don't trigger WhenAny don't get
    /// removed from AsyncEx's wait queues. Since Wait would only wake a single waiting Task, the next Set on the event
    /// might wake one of the abandoned Tasks, not an active one currently belonging to WhenAny.
    /// </para>
    /// <para>
    /// This code must be ported to TypeScript to run in the mobile apps and HTML5 viewers. Since TypeScript doesn't
    /// have a library like AsyncEx, we have to write our own there anyway. Better to keep the .NET and JavaScript
    /// implementations of the transport layer as close as possible.
    /// </para>
    /// </summary>
    /// <remarks>
    /// Unlike AsyncEx, this implementation does not support <see cref="System.Threading.CancellationToken"/>. However,
    /// with <see cref="WhenAny(AsyncEventWaitHandle[])"/>, you can create an <see cref="AsyncManualResetEvent"/> for
    /// cancellation and wait on it.
    /// </remarks>
    public abstract class AsyncEventWaitHandle
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="autoReset">True for auto reset; false for manual reset</param>
        /// <param name="initialState">Whether the event is initially set</param>
        protected AsyncEventWaitHandle(bool autoReset, bool initialState)
        {
            _AutoReset = autoReset;
            _IsSet = initialState;
            _Waiters = new Queue<Waiter>();
        }

        /// <summary>
        /// Reads whether the event is currently set
        /// </summary>
        public bool IsSet
        {
            get { return _IsSet; }
        }

        /// <summary>
        /// Sets the event
        /// </summary>
        public void Set()
        {
            lock (this)
            {
                while (_Waiters.Count > 0)
                {
                    var waiter = _Waiters.Dequeue();

                    // For auto-reset, abort after the first Task is released. For manual-reset, release all Tasks.
                    if (waiter.TrySetComplete() && _AutoReset)
                    {
                        return;
                    }
                }

                _IsSet = true;
            }
        }

        /// <summary>
        /// Unsets the event
        /// </summary>
        public void Reset()
        {
            lock (this)
            {
                _IsSet = false;
            }
        }

        private Task WaitInternal(Waiter waiter, bool createWaiter = false)
        {
            lock (this)
            {
                if (_IsSet)
                {
                    if (_AutoReset)
                    {
                        _IsSet = false;
                    }

                    if (waiter != null)
                    {
                        waiter.TrySetComplete();
                        return waiter.Task;
                    }
                    else
                    {
                        return Task.CompletedTask;
                    }
                }

                if (createWaiter)
                {
                    var w = new Waiter();
                    _Waiters.Enqueue(w);
                    return w.Task;
                }

                if (waiter != null)
                {
                    _Waiters.Enqueue(waiter);
                }

                return null;
            }
        }

        /// <summary>
        /// Creates a <see cref="Task"/> that waits on this event
        /// </summary>
        /// <returns><see cref="Task"/> that completes when this event is set</returns>
        public Task WaitAsync()
        {
            return WaitInternal(null, true);
        }

        /// <summary>
        /// Waits on all of the events provided. Unblocks as soon as the first one is set.
        /// </summary>
        /// <param name="events">Events to wait on</param>
        public static Task WhenAny(params AsyncEventWaitHandle[] events)
        {
            return WhenAny(0, events);
        }
        
        /// <summary>
        /// Waits on all of the events provided. Unblocks as soon as the first one is set, or whenever the timeout
        /// expires, whichever occurs first.
        /// </summary>
        /// <param name="millisecondsTimeout">Timeout, in milliseconds</param>
        /// <param name="events">Events to wait on</param>
        public static Task WhenAny(int millisecondsTimeout, params AsyncEventWaitHandle[] events)
        {
            // Before creating a Task and enqueing it, which results in unnecessary heap allocations and garbage
            // collection, make a quick pass through all events to check if any are already set
            foreach (var e in events)
            {
                var task = e.WaitInternal(null);
                if (task != null)
                {
                    return task;
                }
            }

            var waiter = new Waiter();

            // Handle timeout
            var eventsAndTimeout = new List<AsyncEventWaitHandle>(events);
            if (millisecondsTimeout > 0)
            {
                eventsAndTimeout.Add(new AsyncTimerEvent(millisecondsTimeout));
            }

            foreach (var e in eventsAndTimeout)
            {
                var task = e.WaitInternal(waiter);
                if (task != null)
                {
                    return task;
                }
            }

            return waiter.Task;
        }

        private bool _AutoReset;
        private bool _IsSet;
        private Queue<Waiter> _Waiters;

        /// <summary>
        /// Thin wrapper around <see cref="TaskCompletionSource{TResult}"/> to make it support void results and to
        /// provide thread-safety
        /// </summary>
        private class Waiter
        {
            public Waiter()
            {
                _TCS = new TaskCompletionSource<object>(TaskCreationOptions.RunContinuationsAsynchronously);
            }

            public Task Task
            {
                get { return _TCS.Task; }
            }

            public bool TrySetComplete()
            {
                lock (this)
                {
                    return _TCS.TrySetResult(this);
                }
            }

            public bool TrySetCanceled()
            {
                lock (this)
                {
                    return _TCS.TrySetCanceled();
                }
            }

            private TaskCompletionSource<object> _TCS;
        }
    }
}
