namespace WhiteboardServer.Common.Coordination
{
    /// <summary>
    /// Async version of <see cref="System.Threading.ManualResetEvent"/>
    /// </summary>
    public class AsyncManualResetEvent : AsyncEventWaitHandle
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="initialState">Whether the event is intially set</param>
        public AsyncManualResetEvent(bool initialState = false) : base(false, initialState)
        {
        }
    }
}
