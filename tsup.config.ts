import { defineConfig } from "tsup";
import { copyFileSync } from "node:fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  // Plain CSS, not Tailwind utilities or CSS-in-JS — see src/styles.css for
  // why: this package must render identically regardless of which Tailwind
  // major version (or none) the consuming app runs.
  onSuccess: async () => {
    copyFileSync("src/styles.css", "dist/styles.css");
  },
});
