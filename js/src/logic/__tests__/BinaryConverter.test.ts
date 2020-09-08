// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

import { BinaryConverter } from '../BinaryConverter';

describe('BinaryConverter', () => {

  it('UInt64', () => {
    const buffer = new Uint8Array(9);

    BinaryConverter.writeUInt64(buffer, 1, 0);
    const value1 = BinaryConverter.readUInt64(buffer, 1);
    expect(value1).toEqual(0);

    // JavaScript can't handle the largest unsigned 64-bit number, so go as high as it will
    BinaryConverter.writeUInt64(buffer, 1, Number.MAX_SAFE_INTEGER);
    const value2 = BinaryConverter.readUInt64(buffer, 1);
    expect(value2).toEqual(Number.MAX_SAFE_INTEGER);
  });

  it('Int32', () => {
    const buffer = new Uint8Array(5);

    BinaryConverter.writeInt32(buffer, 1, 0);
    const value1 = BinaryConverter.readInt32(buffer, 1);
    expect(value1).toEqual(0);

    BinaryConverter.writeInt32(buffer, 1, 2147483647);
    const value2 = BinaryConverter.readInt32(buffer, 1);
    expect(value2).toEqual(2147483647);

    BinaryConverter.writeInt32(buffer, 1, -2147483648);
    const value3 = BinaryConverter.readInt32(buffer, 1);
    expect(value3).toEqual(-2147483648);
  });

  it('UInt16', () => {
    const buffer = new Uint8Array(3);

    BinaryConverter.writeUInt16(buffer, 1, 0);
    const value1 = BinaryConverter.readUInt16(buffer, 1);
    expect(value1).toEqual(0);

    BinaryConverter.writeUInt16(buffer, 1, 0xffff);
    const value2 = BinaryConverter.readUInt16(buffer, 1);
    expect(value2).toEqual(0xffff);
  });

  it('Int16', () => {
    const buffer = new Uint8Array(3);

    BinaryConverter.writeInt16(buffer, 1, 0);
    const value1 = BinaryConverter.readInt16(buffer, 1);
    expect(value1).toEqual(0);

    BinaryConverter.writeInt16(buffer, 1, 32767);
    const value2 = BinaryConverter.readInt16(buffer, 1);
    expect(value2).toEqual(32767);

    BinaryConverter.writeInt16(buffer, 1, -32768);
    const value3 = BinaryConverter.readInt16(buffer, 1);
    expect(value3).toEqual(-32768);
  });

});
