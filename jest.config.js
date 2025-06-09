export default {
  testEnvironment: 'jsdom',
  setupFiles: ['./tests/setup/audioContext.js'],
  setupFilesAfterEnv: ['jest-canvas-mock'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
