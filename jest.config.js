module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!**/index.js', '!**/*Validator.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'test'],
  coverageReporters: ['json', 'text', 'text-summary', 'lcov', 'json-summary'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true
};
