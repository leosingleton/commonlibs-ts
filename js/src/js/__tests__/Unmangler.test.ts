// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { GlobalUnmangler, Unmangler, UnmanglerFlags } from '../Unmangler';

describe('Unmangler', () => {

  it('Unmangles an object', () => {
    const unmangler = new Unmangler();
    unmangler.addProperties({
      mangledProp: 'unmangledProp'
    });

    const result = unmangler.unmangleObject({
      mangledProp: 5
    });
    expect(result).toEqual({
      unmangledProp: 5
    } as any);
  });

  it('Mangles an object', () => {
    const unmangler = new Unmangler();
    unmangler.addProperties({
      mangledProp: 'unmangledProp'
    });

    const result = unmangler.mangleObject({
      unmangledProp: 5
    });
    expect(result).toEqual({
      mangledProp: 5
    } as any);
  });

  it('Unmangles an object recursively', () => {
    const unmangler = new Unmangler();
    unmangler.addProperties({
      mangledProp: 'unmangledProp'
    });

    const result = unmangler.unmangleObject({
      mangledProp: 5,
      child: {
        mangledProp: 7
      }
    }, UnmanglerFlags.RecurseAll);
    expect(result).toEqual({
      unmangledProp: 5,
      child: {
        unmangledProp: 7
      }
    } as any);
  });

  it('Has a global instance', () => {
    GlobalUnmangler.addProperties({
      mangledProp: 'unmangledProp'
    });

    const result = GlobalUnmangler.unmangleObject({
      mangledProp: 5
    });
    expect(result).toEqual({
      unmangledProp: 5
    } as any);
  });

});
