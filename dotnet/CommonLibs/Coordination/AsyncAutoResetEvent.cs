// LeoSingleton.CommonLibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

namespace LeoSingleton.CommonLibs.Coordination
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
