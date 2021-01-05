module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!**/index.js', '!**/*Validator.js', '!**/*Logger.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'test'],
  coverageReporters: ['json', 'text', 'text-summary', 'lcov', 'json-summary'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/unit/**/*.spec.js', '<rootDir>/test/integration/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  preset: '@shelf/jest-mongodb',
  testTimeout: 30000,
};
