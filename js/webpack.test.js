// @leosingleton/commonlibs - Common Libraries for TypeScript and .NET Core
// Copyright (c) Leo C. Singleton IV <leo@leosingleton.com>
// See LICENSE in the project root for license information.

const path = require('path');
const glob = require('glob');

const tests = {
  entry: glob.sync('./src/**/__tests__/**/*.@(test|web).ts'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts' ]
  },
  output: {
    path: path.resolve(__dirname, 'build/test'),
    filename: 'test.js',
    library: 'library'
  }
};

const webworker = {
  entry: './src/__tests__/WebWorker.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts' ]
  },
  output: {
    path: path.resolve(__dirname, 'build/test'),
    filename: 'test-worker.js',
    library: 'library'
  }
};

module.exports = [tests, webworker];
