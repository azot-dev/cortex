module.exports = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsConfig: "./tsconfig.json",
      },
    ],
  },
  testMatch: ["**/*.(test|spec).(ts|tsx)"],
};
