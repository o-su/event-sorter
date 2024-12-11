import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coverageProvider: "v8",
};

export default config;
