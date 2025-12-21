export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/src/__test__/**/*.test.js", "**/src/__test__/**/*.spec.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/__test__/**", "!src/seed/**"],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000,
};
