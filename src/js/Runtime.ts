// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

let _isNode = (typeof self === 'undefined');

let _global = (_isNode ? this : self) as any;

// This check comes from emscripten:	
// https://github.com/kripken/emscripten/blob/54b0f19d9e8130de16053b0915d114c346c99f17/src/shell.js	
let _isWebWorker = (typeof _global.importScripts === 'function');

export namespace Runtime {
  /** Boolean used to special case behavior for NodeJS versus web browsers (the latter also includes web workers) */
  export const isNode = _isNode;

  /** globalThis isn't widely supported yet and breaks the Jest tests. Use this instead... */
  export const global = _global;

  /** Boolean used to special case behavior when running inside a WebWorker */
  export const isWebWorker = _isWebWorker;

  /** Boolean indicating whether we are executing on a standard browser page with DOM */
  export const isWindow = !isNode && !isWebWorker;
}
