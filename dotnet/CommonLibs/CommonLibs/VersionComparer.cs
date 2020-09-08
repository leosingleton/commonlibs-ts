using System;

namespace WhiteboardServer.Common
{
    /// <summary>
    /// Helper class for comparing version numbers
    /// </summary>
    public static class VersionComparer
    {
        /// <summary>
        /// Returns the lower of two version numbers
        /// </summary>
        /// <typeparam name="T">Type of the components. Generally an integer type like int or ushort.</typeparam>
        /// <param name="version1">
        /// Version number, in component format. Each element of the array represents one component, starting with the
        /// major version.
        /// </param>
        /// <param name="version2">
        /// Version number, in component format. Each element of the array represents one component, starting with the
        /// major version.
        /// </param>
        /// <returns>
        /// Version number, in component format. Each element of the array represents one component, starting with the
        /// major version.
        /// </returns>
        public static T[] Lower<T>(T[] version1, T[] version2) where T : IComparable<T>
        {
            if (version1 == null || version1.Length == 0)
            {
                throw new ArgumentNullException(nameof(version1));
            }
            if (version2 == null || version2.Length == 0)
            {
                throw new ArgumentNullException(nameof(version2));
            }
            if (version1.Length != version2.Length)
            {
                throw new ArgumentException("Version numbers must have same number of components", nameof(version2));
            }

            // The actual implementation uses a recursive method
            var result = new T[version1.Length];
            LowerRecursiveInternal(version1, version2, 0, result);
            return result;
        }

        private static void LowerRecursiveInternal<T>(T[] version1, T[] version2, int start, T[] result)
            where T : IComparable<T>
        {
            if (start >= version1.Length)
            {
                return;
            }

            int compare = version1[start].CompareTo(version2[start]);
            if (compare < 0)
            {
                for (int n = start; n < version1.Length; n++)
                {
                    result[n] = version1[n];
                }
            }
            else if (compare > 0)
            {
                for (int n = start; n < version1.Length; n++)
                {
                    result[n] = version2[n];
                }
            }
            else
            {
                result[start] = version1[start];
                LowerRecursiveInternal(version1, version2, start + 1, result);
            }
        }
    }
}
