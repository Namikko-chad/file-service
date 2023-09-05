module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*controller.ts', '**/*service.ts', '**/*processor.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
