// src/common/VersionComparer.ts
// Copyright 2016-2018 Leo C. Singleton IV <leo@leosingleton.com>

/** Helper class for comparing version numbers */
export class VersionComparer {
  /**
   * Returns the lower of two version numbers
   * @param version1 Version number, in component format. Each element of the array represents one component, starting
   *    with the major version.
   * @param version2 Version number, in component format. Each element of the array represents one component, starting
   *    with the major version.
   * @returns Version number, in component format. Each element of the array represents one component, starting
   *    with the major version.
   */
  public static lower(version1: number[], version2: number[]): number[] {
    if (!version1 || version1.length === 0) {
      throw new Error('Argument null: version1');
    }
    if (!version2 || version2.length === 0) {
      throw new Error('Argument null: version2');
    }
    if (version1.length !== version2.length) {
      throw new Error('Version numbers must have same number of components');
    }

    // The actual implementation uses a recursive method
    let result: number[] = [];
    this.lowerRecursiveInternal(version1, version2, 0, result);
    return result;
  }

  private static lowerRecursiveInternal(version1: number[], version2: number[], start: number, result: number[]):
      void {
    if (start >= version1.length) {
      return;
    }

    if (version1[start] < version2[start]) {
      for (let n = start; n < version1.length; n++) {
        result[n] = version1[n];
      }
    } else if (version1[start] > version2[start]) {
      for (let n = start; n < version1.length; n++) {
        result[n] = version2[n];
      }
    } else {
      result[start] = version1[start];
      this.lowerRecursiveInternal(version1, version2, start + 1, result);
    }
  }
}
