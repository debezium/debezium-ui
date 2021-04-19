module.exports = {
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
  collectCoverage: true,
  "coverageThreshold": {
    "global": {
      "lines": 90,
      "statements": 90
    }
  },
  "moduleNameMapper": {
    "\\.(css|less|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy"
  },
  "moduleDirectories": ["node_modules", "src"],
  setupFilesAfterEnv: [
    "<rootDir>/setupEnzyme.ts"
  ],
  testPathIgnorePatterns: ['/node_modules/', 'dist'], // 
  transform: {
		"^.+\\.tsx?$": "ts-jest"
	},
};