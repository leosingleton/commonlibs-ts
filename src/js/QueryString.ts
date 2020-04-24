// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

export interface ParsedQueryString { [key: string]: string }

/** Parses the current page's query string */
export function parseQueryString(): ParsedQueryString {
  const pl =/\+/g; // Regex for replacing addition symbol with a space
  const search = /([^&=]+)=?([^&]*)/g;
  const query = window.location.search.substring(1);

  const decode = (s: string) => {
    return decodeURIComponent(s.replace(pl, ' '));
  };

  let match: RegExpExecArray;
  const result: ParsedQueryString = {};
  while ((match = search.exec(query))) {
    result[decode(match[1])] = decode(match[2]);
  }

  return result;
}
