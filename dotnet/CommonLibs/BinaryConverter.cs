namespace WhiteboardServer.Common
{
    /// <summary>
    /// .NET's built-in BinaryReader/BinaryWriter doesn't support network byte order, nor does the BitConverter class.
    /// So we build our own...
    /// </summary>
    public static class BinaryConverter
    {
        /// <summary>
        /// Reads an unsigned 64-bit integer from a binary buffer
        /// </summary>
        /// <param name="buffer">Input buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <returns>Unsigned 64-bit integer</returns>
        public static ulong ReadUInt64(byte[] buffer, int startIndex)
        {
            return ((ulong)buffer[startIndex] << 56) |
                ((ulong)buffer[startIndex + 1] << 48) |
                ((ulong)buffer[startIndex + 2] << 40) |
                ((ulong)buffer[startIndex + 3] << 32) |
                ((ulong)buffer[startIndex + 4] << 24) |
                ((ulong)buffer[startIndex + 5] << 16) |
                ((ulong)buffer[startIndex + 6] << 8) |
                (ulong)buffer[startIndex + 7];
        }

        /// <summary>
        /// Writes an unsigned 64-bit integer to a binary buffer
        /// </summary>
        /// <param name="buffer">Output buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <param name="value">Unsigned 64-bit integer</param>
        public static void Write(byte[] buffer, int startIndex, ulong value)
        {
            buffer[startIndex] = (byte)((value & 0xff00000000000000) >> 56);
            buffer[startIndex + 1] = (byte)((value & 0xff000000000000) >> 48);
            buffer[startIndex + 2] = (byte)((value & 0xff0000000000) >> 40);
            buffer[startIndex + 3] = (byte)((value & 0xff00000000) >> 32);
            buffer[startIndex + 4] = (byte)((value & 0xff000000) >> 24);
            buffer[startIndex + 5] = (byte)((value & 0xff0000) >> 16);
            buffer[startIndex + 6] = (byte)((value & 0xff00) >> 8);
            buffer[startIndex + 7] = (byte)(value & 0xff);
        }

        /// <summary>
        /// Reads a signed 32-bit integer from a binary buffer
        /// </summary>
        /// <param name="buffer">Input buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <returns>Signed 32-bit integer</returns>
        public static int ReadInt32(byte[] buffer, int startIndex)
        {
            return (buffer[startIndex] << 24) |
                (buffer[startIndex + 1] << 16) |
                (buffer[startIndex + 2] << 8) |
                buffer[startIndex + 3];
        }

        /// <summary>
        /// Writes a signed 32-bit integer to a binary buffer
        /// </summary>
        /// <param name="buffer">Output buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <param name="value">Signed 32-bit integer</param>
        public static void Write(byte[] buffer, int startIndex, int value)
        {
            buffer[startIndex] = (byte)((value & 0xff000000) >> 24);
            buffer[startIndex + 1] = (byte)((value & 0xff0000) >> 16);
            buffer[startIndex + 2] = (byte)((value & 0xff00) >> 8);
            buffer[startIndex + 3] = (byte)(value & 0xff);
        }

        /// <summary>
        /// Reads an unsigned 16-bit integer from a binary buffer
        /// </summary>
        /// <param name="buffer">Input buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <returns>Unsigned 16-bit integer</returns>
        public static ushort ReadUInt16(byte[] buffer, int startIndex)
        {
            return (ushort)((buffer[startIndex] << 8) | buffer[startIndex + 1]);
        }

        /// <summary>
        /// Writes an unsigned 16-bit integer to a binary buffer
        /// </summary>
        /// <param name="buffer">Output buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <param name="value">Unsigned 16-bit integer</param>
        public static void Write(byte[] buffer, int startIndex, ushort value)
        {
            buffer[startIndex] = (byte)((value & 0xff00) >> 8);
            buffer[startIndex + 1] = (byte)(value & 0xff);
        }

        /// <summary>
        /// Reads a signed 16-bit integer from a binary buffer
        /// </summary>
        /// <param name="buffer">Input buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <returns>Signed 16-bit integer</returns>
        public static short ReadInt16(byte[] buffer, int startIndex)
        {
            return (short)((buffer[startIndex] << 8) | buffer[startIndex + 1]);
        }

        /// <summary>
        /// Writes an signed 16-bit integer to a binary buffer
        /// </summary>
        /// <param name="buffer">Output buffer</param>
        /// <param name="startIndex">Starting offset, in bytes</param>
        /// <param name="value">Signed 16-bit integer</param>
        public static void Write(byte[] buffer, int startIndex, short value)
        {
            buffer[startIndex] = (byte)((value & 0xff00) >> 8);
            buffer[startIndex + 1] = (byte)(value & 0xff);
        }
    }
}
