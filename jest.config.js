const minimumCoveragePercentage = 100

module.exports = {
  preset: "jest-expo",
  transform: {
    "^.+\\.(js|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(expo-notifications|expo-asset|expo-constants|expo-application|expo-modules-core|expo|react-native|@react-native|@expo|@react-native-community)/)",
  ],
  coverageProvider: "v8",
  collectCoverageFrom: ["./src/**", "!src/types/**"],
  coverageThreshold: {
    global: {
      lines: minimumCoveragePercentage,
      functions: minimumCoveragePercentage,
      branches: minimumCoveragePercentage,
      statements: minimumCoveragePercentage,
    },
  },
  coverageReporters: ["json-summary", "text", "lcov"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
}
