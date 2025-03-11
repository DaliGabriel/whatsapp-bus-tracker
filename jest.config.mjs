export default {
  preset: "ts-jest/presets/default-esm", // ✅ Uses the recommended ESM preset
  testEnvironment: "node",
  verbose: true,
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }], // ✅ Correct way to configure ts-jest
  },
};
