// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

export type ParsedQueryString = { [key: string]: string };

/**
 * Parses the current page's query string
 */
export function parseQueryString(): ParsedQueryString {
  let pl =/\+/g; // Regex for replacing addition symbol with a space
  let search = /([^&=]+)=?([^&]*)/g;
  let query = window.location.search.substring(1);

  let decode = (s: string) => {
    return decodeURIComponent(s.replace(pl, ' '));
  };

  let match: RegExpExecArray;
  let result: ParsedQueryString = {};
  while (match = search.exec(query)) {
    result[decode(match[1])] = decode(match[2]);
  }

  return result;
}
