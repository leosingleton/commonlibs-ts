// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

const _isInNode = (typeof self === 'undefined');

const _globalObject = (_isInNode ? this : self) as any;

// This check comes from emscripten:
// https://github.com/kripken/emscripten/blob/54b0f19d9e8130de16053b0915d114c346c99f17/src/shell.js
const _isInWebWorker = (typeof _globalObject.importScripts === 'function');

export namespace Runtime {
  /** Boolean used to special case behavior for NodeJS versus web browsers (the latter also includes web workers) */
  export const isInNode = _isInNode;

  /** `globalThis` isn't widely supported yet and breaks the Jest tests. Use this instead... */
  export const globalObject = _globalObject;

  /** Boolean used to special case behavior when running inside a WebWorker */
  export const isInWebWorker = _isInWebWorker;

  /** Boolean indicating whether we are executing on a standard browser page with DOM */
  export const isInWindow = !isInNode && !isInWebWorker;

  /**
   * Exports a function or object to the global namespace without mangling
   * @param name Unmangled name of the export
   * @param value Function or object to export
   * @param namespace Optional namespace, consisting of one or more namespaces separated by dots
   */
  export function exportGlobal(name: string, value: any, namespace?: string): void {
    const rootObject = getGlobalObject<any>(namespace);
    rootObject[name] = value;
  }

  /**
   * Exports multiple functions and/or objects to the global namespace without mangling
   * @param exports Array of name/value tuples containing the unmangled name and values to export
   * @param namespace Optional namespace, consisting of one or more namespaces separated by dots
   */
  export function exportGlobals(exports: [string, any][], namespace?: string): void {
    const rootObject = getGlobalObject<any>(namespace);
    for (const e of exports) {
      rootObject[e[0]] = e[1];
    }
  }

  /**
   * Gets the global object (i.e. `globalThis`) or a namespace under this object
   * @param namespace Optional namespace, consisting of one or more namespaces separated by dots
   */
  export function getGlobalObject<T>(namespace?: string): T {
    let object = Runtime.globalObject;

    // Find the namespace where the function should be exported, creating namespaces as needed
    if (namespace) {
      const namespaceParts = namespace.split('.');
      for (const part of namespaceParts) {
        if (!object[part]) {
          object[part] = {};
        }
        object = object[part];
      }
    }

    return object;
  }
}
