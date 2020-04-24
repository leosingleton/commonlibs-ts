// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { Runtime } from './Runtime';
import { AsyncManualResetEvent } from '../coordination/AsyncManualResetEvent';

/**
 * Similar to jQuery's `$(document).ready()`, but doesn't require jQuery. This event doesn't support some older web
 * browsers, but that's not a big concern given our heavy dependency on new web technologies.
 */
export class DocumentReady {
  /** Returns whether the DOM is ready */
  public static isReady(): boolean {
    DocumentReady.initializeEvent();
    return DocumentReady.documentReadyEvent.getIsSet();
  }

  /** Blocks until the DOM is ready */
  public static async waitUntilReady(): Promise<void> {
    DocumentReady.initializeEvent();
    await DocumentReady.documentReadyEvent.waitAsync();
  }

  /** Set when the DOM is ready */
  private static documentReadyEvent: AsyncManualResetEvent;

  /** Ensures `documentReadyEvent` is initialized and listeners are registered */
  private static initializeEvent(): void {
    if (!DocumentReady.documentReadyEvent) {
      DocumentReady.documentReadyEvent = new AsyncManualResetEvent();
      if (Runtime.isInWindow) {
        if (document.readyState === 'complete') {
          DocumentReady.documentReadyEvent.setEvent();
        } else {
          document.addEventListener('DOMContentLoaded', () => DocumentReady.documentReadyEvent.setEvent());
        }
      } else {
        DocumentReady.documentReadyEvent.setEvent();
      }
    }
  }
}
