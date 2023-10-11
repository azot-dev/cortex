module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.(test|spec).(ts|tsx)'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
