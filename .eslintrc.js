'use strict';

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    jest: true,
    describe: true,
    it: true,
    xit: true,
    beforeEach: true,
    afterEach: true,
    beforeAll: true,
    afterAll: true,
    expect: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['prettier'],
  rules: {
    'no-prototype-builtins': 'off',
    'prettier/prettier': 'error',
    'spaced-comment': 'error',
    'prefer-const': 'error',
  },
};
