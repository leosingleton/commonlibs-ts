// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

let _isInNode = (typeof self === 'undefined');

let _globalObject = (_isInNode ? this : self) as any;

// This check comes from emscripten:	
// https://github.com/kripken/emscripten/blob/54b0f19d9e8130de16053b0915d114c346c99f17/src/shell.js	
let _isInWebWorker = (typeof _globalObject.importScripts === 'function');

export namespace Runtime {
  /** Boolean used to special case behavior for NodeJS versus web browsers (the latter also includes web workers) */
  export const isInNode = _isInNode;

  /** globalThis isn't widely supported yet and breaks the Jest tests. Use this instead... */
  export const globalObject = _globalObject;

  /** Boolean used to special case behavior when running inside a WebWorker */
  export const isInWebWorker = _isInWebWorker;

  /** Boolean indicating whether we are executing on a standard browser page with DOM */
  export const isInWindow = !isInNode && !isInWebWorker;
}
