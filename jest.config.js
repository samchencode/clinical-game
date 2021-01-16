module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/__tests__"],
  testMatch: ["**/*\\.(test|spec)\\.(t|j)s", "**/*\\.(test|spec)\\.(t|j)sx"],
  transform: {
    "^.+.tsx?$": "ts-jest",
    "^.+\\.vue$": "vue-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
