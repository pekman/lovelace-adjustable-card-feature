import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/adjustable-card-feature.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript(),
    json(),
  ],
};
