module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/e2e/**/*.test.js'],
  setupFiles: ['dotenv/config'],
  testTimeout: 30000,
  verbose: true,
};
