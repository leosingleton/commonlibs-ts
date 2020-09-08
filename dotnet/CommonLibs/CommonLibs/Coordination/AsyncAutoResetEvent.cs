namespace WhiteboardServer.Common.Coordination
{
    /// <summary>
    /// Async version of <see cref="System.Threading.AutoResetEvent"/>
    /// </summary>
    public class AsyncAutoResetEvent : AsyncEventWaitHandle
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="initialState">Whether the event is intially set</param>
        public AsyncAutoResetEvent(bool initialState = false) : base(true, initialState)
        {
        }
    }
}
