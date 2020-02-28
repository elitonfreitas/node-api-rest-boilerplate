module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!**/index.js', '!**/*Validator.js', '!jest.config.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'test', 'jest.config.js'],
  coverageReporters: ['json', 'text', 'text-summary', 'lcov', 'json-summary'],
  modulePathIgnorePatterns: ['jest.config.js'],
  testEnvironment: 'node',
  testMatch: ['**/test/unit/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', 'jest.config.js'],
  verbose: true
};
