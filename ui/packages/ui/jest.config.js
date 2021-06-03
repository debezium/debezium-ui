// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // The pattern or patterns Jest uses to detect test files
  testRegex: "(/__tests__/.*|(\\.|/)(test))\\.tsx?$",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/app/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/dist/",
  ],

  // This will be used to configure minimum threshold enforcement for coverage results.
  // coverageThreshold: {
  //   global: {
  //     lines: 90,
  //     statements: 90,
  //   },
  // },

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["node_modules", "src"],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "\\.(css|less)$":
      "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "^shared(.*)$": "<rootDir>/src/app/shared$1",
    "^components(.*)$": "<rootDir>/src/app/components$1",
    "^assets(.*)$": "<rootDir>/assets$1",
    "^i18n(.*)$": "<rootDir>/src/i18n$1",
    "^layout(.*)$": "<rootDir>/src/app/layout$1",
  },

  // The path to a module that runs some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/test-setup.ts"],

  testPathIgnorePatterns: ["/node_modules/", "dist"],

  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
