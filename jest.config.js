module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/'],
  collectCoverage: true,
  coverageDirectory: 'build/coverage/'
};