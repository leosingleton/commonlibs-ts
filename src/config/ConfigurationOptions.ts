// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { ParsedQueryString, parseQueryString } from '../js/QueryString';
import { Runtime } from '../js/Runtime';

/** Storage type for each configuration option */
export const enum StorageType {
  /**
   * Allows the option to be specified either via local storage or the query string. Local storage is shared between
   * all tabs of a web browser, and persists after close. If the value is set in both local storage and the query
   * string, the value in the query string takes priority.
   */
  Local,

  /**
   * Allows the option to be specified either via session storage or the query string. Session storage is specific to
   * a tab, and doesn't persist after close. If the value is set in both session storage and the query string, the
   * the value in the query string takes priority.
   */
  Session,

  /**
   * Allows the option to be specified via local storage, without allowing override via the query string. Local storage
   * is shared between all tabs of a web browser, and persists after close.
   */
  LocalOnly,

  /**
   * Allows the option to be specified via session storage, without allowing override via the query string. Session
   * storage is specific to a tab, and doesn't persist after close.
   */
  SessionOnly,

  /**
   * Allows the option to be specified via the query string, without allowing any persistence in local or session
   * storage.
   */
  None
}

/** Flags for the ConfigurationOptions constructor */
export const enum ConfigurationFlags {
  /** Default value */
  None = 0,

  /**
   * By default, values supplied via the query string are not written to local/session storage. This flag overrides
   * this behavior, meaning any non-default values specified on the query string will be written to storage where they
   * will apply to subsequent pages, even if the non-default value is no longer specified on the query string.
   */
  WriteQueryStringValuesToStorage = (1 << 0),

  /**
   * By default, if a session storage value does not exist, the default value is written at initialization. This flag
   * suppresses this behavior and does not write default values.
   */
  DoNotWriteDefaultValuesToSessionStorage = (1 << 1),

  /**
   * By default, no local storage values are written unless explicitly invoked by the writeToStorage() method. This
   * flag changes the behavior to automatically write default values to local storage if they do not exist.
   *
   * _WARNING:_ This flag should be used with caution, as it can create upgrade challenges if the default value ever
   * changes.
   */
  WriteDefaultValuesToLocalStorage = (1 << 2),

  /**
   * Allows the class to be used by web workers and NodeJS, which do not have local or session storage. By default,
   * this class throws an exception if it is used outside of a browser. This flag overrides this behavior, and instead
   * allows read-only of the default values for the configuration options.
   */
  AllowNonBrowsers = (1 << 3)
}

/** Base class for configuration options stored in session storage, local storage, and/or the page query string */
export abstract class ConfigurationOptions {
  /**
   * Constructor
   *
   * _IMPORTANT_: The constructor does not fully initialize the object. Derived classes create a constructor which does
   * the following:
   *  1. Calls super() to invoke the parent constructor with the desired prefix and flags
   *  2. Calls initializeValues() to complete the initialization
   *
   * This is due to the order of initialization described here: https://github.com/microsoft/TypeScript/issues/1617
   * The initializeValues() method first requires the derived class's defaults property to be initialized.
   *
   * @param prefix Optional prefix to apply to each option's name
   * @param flags See ConfigurationFlags
   * @param refreshInterval How often local and/or session storage is refreshed, in milliseconds. Default is 5000 ms.
   */
  public constructor(prefix = '', flags = ConfigurationFlags.None, refreshInterval = 5000) {
    this.propertyPrefix = prefix;
    this.configurationFlags = flags;
    this.refreshInterval = refreshInterval;
  }

  /** Must be called by derived classes after they initialize the defaults property */
  protected initializeValues(): void {
    if (Runtime.isInWindow) {
      // Web Browser: Begin syncing from local/session storage
      this.readFromStorage(true);
    } else {
      // In NodeJS or Web Worker
      if ((this.configurationFlags & ConfigurationFlags.AllowNonBrowsers) === 0) {
        throw new Error('Not in a browser');
      }

      // Populate with default values
      const me = this as any;
      const properties = Object.keys(this.defaults);
      for (const property of properties) {
        me[property] = this.defaults[property][2];
      }
    }
  }

  /** Reads configuration from browser storage. Initializes to defaults if not found. */
  private readFromStorage(firstRun: boolean): void {
    // The first instance should parse the query string
    if (firstRun && !ConfigurationOptions.qs) {
      ConfigurationOptions.qs = parseQueryString();
    }

    const flags = this.configurationFlags;
    const me = this as any;
    const properties = Object.keys(this.defaults);
    for (const property of properties) {
      const name = this.propertyPrefix + this.defaults[property][0];
      const type = this.defaults[property][1];
      const defaultValue = this.defaults[property][2];
      let val: string;
      let fromQueryString = false;

      // Query string has highest priority, if enabled
      if (type !== StorageType.LocalOnly && type !== StorageType.SessionOnly) {
        val = ConfigurationOptions.qs[name];
        if (val) {
          fromQueryString = true;
        }
      }

      // Local / session storage has lower priority
      if (!val) {
        if (type === StorageType.Local || type === StorageType.LocalOnly) {
          val = localStorage.getItem(name);
        } else if (type === StorageType.Session || type === StorageType.SessionOnly) {
          val = sessionStorage.getItem(name);
        }
      }

      // Parse the value
      let value: string | number | boolean;
      if (val) {
        const type = typeof defaultValue;
        if (type === 'string') {
          value = val;
        } else if (type === 'number') {
          value = parseFloat(val);
        } else if (type === 'boolean') {
          value = !(val === 'false');
        } else {
          throw new Error(`Unsupported type ${type}`);
        }
      } else {
        value = defaultValue;
      }

      // Set the property's value
      me[property] = value;

      // On the first iteration, perform write back
      if (firstRun && !Runtime.isInWebWorker) {
        if (!fromQueryString || (flags & ConfigurationFlags.WriteQueryStringValuesToStorage) !== 0) {
          let shouldWrite = false;
          if (type === StorageType.Local || type === StorageType.LocalOnly) {
            shouldWrite = (flags & ConfigurationFlags.WriteDefaultValuesToLocalStorage) !== 0;
          } else if (type === StorageType.Session || type === StorageType.SessionOnly) {
            shouldWrite = (flags & ConfigurationFlags.DoNotWriteDefaultValuesToSessionStorage) === 0;
          }

          if (shouldWrite) {
            this.writeToStorageInternal(name, type, value);
          }
        }
      }
    }

    // Reload the configuration every few seconds. This allows you to modify browser storage using Chrome's dev tools,
    // and see the changes take effect in realtime, without refreshing the page.
    setTimeout(() => this.readFromStorage(false), this.refreshInterval);
  }

  /**
   * Saves configuration to browser storage
   * @param values An object containing the properties to write. The property names should match those of the derived
   *    class.
   */
  public writeToStorage(values: {[id: string]: string | number | boolean}): void {
    if (Runtime.isInWebWorker) {
      throw new Error('Cannot write from web worker');
    }

    const me = this as any;
    const properties = Object.keys(values);
    for (const property of properties) {
      if (!this.defaults[property]) {
        throw new Error(`Unknown property ${property}`);
      }

      const name = this.propertyPrefix + this.defaults[property][0];
      const type = this.defaults[property][1];
      const value = values[property];
      me[property] = value;
      this.writeToStorageInternal(name, type, value);
    }
  }

  private writeToStorageInternal(name: string, type: StorageType, value: string | number | boolean): void {
    const val = value.toString();
    switch (type) {
      case StorageType.Local:
      case StorageType.LocalOnly:
        localStorage.setItem(name, val);
        break;

      case StorageType.Session:
      case StorageType.SessionOnly:
        sessionStorage.setItem(name, val);
        break;

      default:
        // The property is a type that does not allow persistent storage
        throw new Error(`${name} has storage type ${type}`);
    }
  }

  /**
   * Default values if not present in browser storage. Also decribes the behavior of each configuration option.
   * @param id Name of the member variable in the derived class to read/write the value from. This is separate from
   *    tuple[0] as it may get mangled by uglify-js or other JavaScript minifiers.
   * @param tuple Tuple to describe the value:
   *   1. (string): ID of the value as stored in browser storage
   *   2. (StorageType): Determines whether to use local storage, session storage, and/or the query string
   *   3. (string | number | boolean): Default value for the configuration option
   */
  protected abstract defaults: {[id: string]: [string, StorageType, string | number | boolean]};

  /** Prefix to apply to each option's name */
  private propertyPrefix: string;

  /** Configuration flags */
  private configurationFlags: ConfigurationFlags;

  /** How often local and/or session storage is refreshed, in milliseconds */
  private refreshInterval: number;

  /** The browser's query string, parsed once at initialization */
  private static qs: ParsedQueryString;
}
