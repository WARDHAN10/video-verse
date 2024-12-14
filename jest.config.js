module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',  
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',  
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',  
  coverageProvider: 'v8',  
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'], 
};