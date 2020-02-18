'use strict';

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    'Promise': true,
    'describe': true,
    'it': true,
    'xit': true,
    'beforeEach': true,
    'afterEach': true,
    'should': true,
    'expect': true,
    'assert': true,
    'after': true
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['prettier'],
  rules: {
    'no-prototype-builtins': 'off',
    'prettier/prettier': 'error',
    'spaced-comment': 'error',
    'prefer-const': 'error'
  }
};
