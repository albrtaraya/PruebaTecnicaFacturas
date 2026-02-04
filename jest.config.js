/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
