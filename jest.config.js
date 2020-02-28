module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!**/index.js', '!**/*Validator.js', '!jest.config.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'test'],
  coverageReporters: ['json', 'text', 'text-summary', 'lcov', 'json-summary'],
  testEnvironment: 'node',
  testMatch: ['**/test/unit/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true
};
