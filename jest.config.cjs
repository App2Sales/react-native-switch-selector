module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  moduleNameMapper: {
    '^react-native-switch-selector$': '<rootDir>/index.js',
  },
};
