// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Runtime } from './Runtime';
import { AsyncManualResetEvent } from '../coordination/AsyncManualResetEvent';

/** Set when the DOM is ready */
let documentReadyEvent = new AsyncManualResetEvent();

export class DocumentReady {
  /** Returns whether the DOM is ready */
  public static isReady(): boolean {
    return documentReadyEvent.getIsSet();
  }

  /** Blocks until the DOM is ready */
  public static async waitUntilReady(): Promise<void> {
    await documentReadyEvent.waitAsync();
  }
}

if (Runtime.isInWindow) {
  // Similar to jQuery's $(document).ready(), but doesn't require jQuery. This event doesn't support older web
  // browsers, but that's not a big concern given our heavy dependency on new web technologies.
  document.addEventListener('DOMContentLoaded', () => {
    documentReadyEvent.setEvent();
  });
} else {
  documentReadyEvent.setEvent();
}
