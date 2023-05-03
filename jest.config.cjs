module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*controller.ts', '**/*service.ts', '**/*processor.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
