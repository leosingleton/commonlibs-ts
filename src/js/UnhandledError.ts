// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

/** Type of unhandled error */
export const enum ErrorType {
  /** Unhandled error caught by the global error handler */
  UnhandledError,

  /** Unhandled promise rejection caught by the global error handler */
  UnhandledPromiseRejection,

  /** Unhandled promise rejection in an async lambda executed via the TaskScheduler class */
  ScheduledPromiseRejection,

  /** Error reported explicitly by a call to reportError() */
  ReportedError
}

type ErrorHandler = (ue: UnhandledError) => void;

/** Unhandled exceptions details */
export class UnhandledError {
  /** Error message */
  public errorMessage: string;

  /** Type */
  public errorType: ErrorType;

  /** Stack trace (optional) */
  public errorStack?: string;

  public toString(): string {
    let typeString: string;
    switch (this.errorType) {
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

    let result = `${typeString}: ${this.errorMessage}`;
    if (this.errorStack) {
      result += `\n${this.errorStack}`;
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
      for (const ue of errors) {
        handler(ue);
      }
    }
  }
}

/** List of errors already reported. These are sent to handlers and soon as they register. */
const errors: UnhandledError[] = [];

/** Reigstered callbacks */
const handlers: ErrorHandler[] = [];

/** Exported only within commonlibs. Allows the internal library to report errors with a specific type. */
export function reportError(error: any, type: ErrorType): void {
  const ue = new UnhandledError();
  ue.errorType = type;

  if (error instanceof Error) {
    ue.errorMessage = error.message;
    ue.errorStack = error.stack;
  } else {
    ue.errorMessage = error.toString();
  }

  errors.push(ue);

  for (const handler of handlers) {
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
      const eventStr = JSON.stringify(event, null, 4);
      const errorStr = `${eventStr}\n  at ${source}:${lineno}:${colno}`;
      reportError(errorStr, ErrorType.UnhandledError);
    }
  };

  // With promises, this one normally fires instead
  window.addEventListener('unhandledrejection', event => {
    const reason = event.reason;
    reportError(reason, ErrorType.UnhandledPromiseRejection);
  });

  isInitialized = true;
}
