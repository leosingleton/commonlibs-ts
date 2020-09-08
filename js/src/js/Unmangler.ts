// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { deepCopy } from '../logic/DeepCopy';
import { Runtime } from './Runtime';

/** Flags for the `Unmangler` class */
export const enum UnmanglerFlags {
  /** Default */
  None = 0,

  /** Keeps the mangled property in addition to adding the unmangled property name */
  PreserveOriginal = (1 << 0),

  /**
   * Recursively unmangles any properties that are objects. Note that only the property names specified are used for
   * recursion. In addition, it is up to the caller to ensure that the object does not contain any cycles to avoid an
   * infinite loop.
   */
  Recurse = (1 << 1),

  /**
   * Similar to `Recurse`, except recurses on all properties, even those that do not have property names in the
   * specified property list.
   */
  RecurseAll = Recurse | (1 << 2),

  /**
   * By default, the `object` parameter is cloned using a deep copy instead of being modified. With this flag, the
   * original object itself is modified.
   */
  NoClone = (1 << 3)
}

/**
 * Map of mangled property names to unmangled property names. Note that this parameter is designed to allow terser to
 * mangle its properties, but not values, i.e. the caller should pass a value such as:
 * ```
 * {
 *     property1: 'property1',
 *     property2: 'property2'
 * }
 * ```
 */
export interface MangledPropertyMap { [mangledName: string]: string }

/**
 * Helper class for mangling and unmangling objects when writing code that works under terser's `--mangle-props`
 * feature.
 */
export class Unmangler {
  /**
   * Adds properties to the mangled property map
   * @param properties Map of mangled property names to unmangled property names. See the `MangledPropertyMap`
   *    interface.
   */
  public addProperties(properties: MangledPropertyMap): void {
    Object.assign(this.propertyMap, properties);
    this.reversePropertyMap = undefined;
  }

  /**
   * Unmangles an object that was mangled by terser's `--mangle-props` feature
   * @param object Object to unmangle
   * @param flags See `UnmanglerFlags`
   * @returns The resulting unmangled object. If `UnmangleFlags.NoClone` is specified, then `object` is returned.
   */
  public unmangleObject<T>(object: T, flags = UnmanglerFlags.None): T {
    return Unmangler.unmangleObject(object, this.propertyMap, flags);
  }

  /**
   * Mangles an object so it works with code minified with terser's `--mangle-props` feature
   * @param object Object to mangle
   * @param flags See `UnmanglerFlags`
   */
  public mangleObject<T>(object: T, flags = UnmanglerFlags.None): T {
    // Flip the keys and values in propertyMap. Cache this in a member variable for future calls.
    let reversePropertyMap = this.reversePropertyMap;
    if (!reversePropertyMap) {
      reversePropertyMap = this.reversePropertyMap = {};
      for (const unmangledName in this.propertyMap) {
        const mangledName = this.propertyMap[unmangledName];
        reversePropertyMap[mangledName] = unmangledName;
      }
    }

    return Unmangler.unmangleObject(object, reversePropertyMap, flags);
  }

  /** Map of mangled property names to unmangled property names */
  private propertyMap: MangledPropertyMap = {};

  /**
   * Map of unmangled property names to mangled property names. Created from `propertyMap` and cached to speed up future
   * calls.
   */
  private reversePropertyMap: MangledPropertyMap;

  /**
   * Unmangles an object that was mangled by terser's `--mangle-props` feature
   * @param object Object to unmangle
   * @param properties Map of mangled property names to unmangled property names. See the `UnmangleMap` interface.
   * @param flags See `UnmanglerFlags`
   * @returns The resulting unmangled object. If `UnmangleFlags.NoClone` is specified, then `object` is returned.
   */
  public static unmangleObject<T>(object: T, properties: MangledPropertyMap, flags = UnmanglerFlags.None): T {
    // Clone the object parameter if requested. Then remove the NoClone flag to avoid performing further deep copies in
    // the recursive cases below. Cast it to any for manipulation of properties.
    if (!(flags & UnmanglerFlags.NoClone)) {
      object = deepCopy(object);
    }
    flags |= UnmanglerFlags.NoClone;
    const o = object as any;

    if (Array.isArray(o)) {
      // For arrays, we must recurse on the elements
      for (const element of o) {
        Unmangler.unmangleObject(element, properties, flags);
      }
    } else if (typeof o === 'object') {
      // Enumerate all properties in the object
      for (const mangledName in o) {
        const value = o[mangledName];

        // Check whether the property needs to be unmangled
        const unmangledName = properties[mangledName];
        if (unmangledName) {
          if (mangledName !== unmangledName) {
            // Add the unmangled value
            o[unmangledName] = value;

            // Remove the mangled value
            if (!(flags & UnmanglerFlags.PreserveOriginal)) {
              delete o[mangledName];
            }
          }

          if (flags & UnmanglerFlags.Recurse) {
            Unmangler.unmangleObject(value, properties, flags);
          }
        } else if ((flags & UnmanglerFlags.RecurseAll) === UnmanglerFlags.RecurseAll) {
          // Recurse on all properties, not just those in the unmangle list
          Unmangler.unmangleObject(value, properties, flags);
        }
      }
    }

    return object;
  }

  /**
   * Wrapper around `object[property]` to avoid name mangling by terser
   * @param object Object to read
   * @param property Property on `object` to read
   * @returns `object[property]`
   */
  public static getUnmangledProperty<T>(object: any, property: string): T {
    return object[property];
  }

  /**
   * Wrapper around `object[property] = value` to avoid name mangling by terser
   * @param object Object to set
   * @param property Property on `object` to set
   * @param value New property value
   */
  public static setUnmangledProperty(object: any, property: string, value: any): void {
    object[property] = value;
  }

  /**
   * TypeScript's tslib gets broken by terser's `--mangle-props` feature. Call this function once in any code that uses
   * tslib to create mangled copies of the library's exports to fix this.
   */
  public static fixTslib(): void {
    const tslib = require('tslib');
    const unmangler = new Unmangler();
    unmangler.addProperties({
      __assign: '__assign',
      __asyncDelegator: '__asyncDelegator',
      __asyncGenerator: '__asyncGenerator',
      __asyncValues: '__asyncValues',
      __await: '__await',
      __awaiter: '__awaiter',
      __classPrivateFieldGet: '__classPrivateFieldGet',
      __classPrivateFieldSet: '__classPrivateFieldSet',
      __createBinding: '__createBinding', // Added in v2.0.0
      __decorate: '__decorate',
      __exportStar: '__exportStar',
      __extends: '__extends',
      __generator: '__generator',
      __importDefault: '__importDefault',
      __importStar: '__importStar',
      __makeTemplateObject: '__makeTemplateObject',
      __metadata: '__metadata',
      __param: '__param',
      __read: '__read',
      __rest: '__rest',
      __spread: '__spread',
      __spreadArrays: '__spreadArrays',
      __values: '__values'
    });
    unmangler.mangleObject(tslib, UnmanglerFlags.PreserveOriginal | UnmanglerFlags.NoClone);
  }
}

/**
 * An instance of `Unmangler` held in a global variable so that multiple pieces of code can call `addProperties()` and
 * create a global mangle/unmangle map.
 */
export const GlobalUnmangler = getGlobalUnmangler();

function getGlobalUnmangler(): Unmangler {
  /** A globally unique string. Abbreviated version of `"@leosingleton/commonlibs-ts/Unmangler"` */
  const property = '@ls/cl/U';

  let unmangler = Unmangler.getUnmangledProperty<Unmangler>(Runtime.globalObject, property);
  if (!unmangler) {
    // Create on first use
    unmangler = new Unmangler();
    Unmangler.setUnmangledProperty(Runtime.globalObject, property, unmangler);
  }

  return unmangler;
}
