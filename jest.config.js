export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['jest-canvas-mock'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
