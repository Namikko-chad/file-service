/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  injectGlobals: false,
};
