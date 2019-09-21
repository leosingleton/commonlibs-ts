// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/** Type of unhandled error */
export const enum ErrorType {
  /** Unhandled error caught by the global error handler */
  UnhandledError,

  /** Unhandled promise rejection caught by the global error handler */
  UnhandledPromiseRejection,

  /** Error reported explicitly by a call to reportError() */
  ReportedError
}

type ErrorHandler = (ue: UnhandledError) => void;

/** Unhandled exceptions details */
export class UnhandledError {
  /** Error message */
  public message: string;

  /** Type */
  public type: ErrorType;

  /** Stack trace (optional) */
  public stack?: string;

  public toString(): string {
    let typeString: string;
    switch (this.type) {
      case ErrorType.UnhandledError:
        typeString = 'Unhandled Error';
        break;

      case ErrorType.UnhandledPromiseRejection:
        typeString = 'Unhandled Promise Rejection';
        break;

      case ErrorType.ReportedError:
        typeString = 'Reported Error';
        break;
    }

    let result = `${typeString}: ${this.message}`;
    if (this.stack) {
      result += `\n${this.stack}`;
    }

    return result;
  }

  /**
   * Allows code to explicitly report an error from a catch block or other
   * @param error Error object, preferably of type Error
   */
  public static reportError(error: any): void {
    reportError(error, ErrorType.ReportedError);
  }

  /**
   * Registers a handler to receive events on unhandled errors
   * @param handler Callback invoked on an unhandled error
   * @param sendQueued If true, any unhandled errors that occured prior to registering the handler are sent immediately
   */
  public static registerHandler(handler: ErrorHandler, sendQueued = true): void {
    // We register the handlers with window on the first call to this function to avoid doing so in Node.js
    if (!isInitialized) {
      initialize();
    }

    handlers.push(handler);

    if (sendQueued) {
      for (let n = 0; n < errors.length; n++) {
        let ue = errors[n];
        handler(ue);
      }
    }
  }
}

/** List of errors already reported. These are sent to handlers and soon as they register. */
let errors: UnhandledError[] = [];

/** Reigstered callbacks */
let handlers: ErrorHandler[] = [];

function reportError(error: any, type: ErrorType): void {
  let ue = new UnhandledError();
  ue.type = type;

  if (error instanceof Error) {
    ue.message = error.message;
    ue.stack = error.stack;
  } else {
    ue.message = error.toString();
  }

  errors.push(ue);

  for (let n = 0; n < handlers.length; n++) {
    let handler = handlers[n];
    try {
      handler(ue);
    } catch (err) {
      reportError(err, ErrorType.ReportedError);
    }
  }
}

let isInitialized = false;

function initialize(): void {
  // Register an error handler to catch unhandled exceptions
  window.onerror = (event, source, lineno, colno, error) => {
    if (error instanceof Error) {
      reportError(error, ErrorType.UnhandledError);
    } else {
      let eventStr = JSON.stringify(event, null, 4);
      let errorStr = `${eventStr}\n  at ${source}:${lineno}:${colno}`;
      reportError(errorStr, ErrorType.UnhandledError);
    }
  };

  // With promises, this one normally fires instead
  window.addEventListener('unhandledrejection', event => {
    let reason = event.reason;
    reportError(reason, ErrorType.UnhandledPromiseRejection);
  });

  isInitialized = true;
}
