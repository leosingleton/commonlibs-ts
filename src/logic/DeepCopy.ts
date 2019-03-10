// src/common/DeepCopy.ts
// Copyright 2016-2018 Leo C. Singleton IV <leo@leosingleton.com>

/**
 * Performs a deep copy of an object
 * @param obj Object to copy
 */
export function deepCopy<T>(obj: T): T {
  // Most efficient according to:
  // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
  return JSON.parse(JSON.stringify(obj));
}
