import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone Node/CommonJS maintenance scripts, run directly via
    // `node scripts/*.js` — not part of the Next.js app bundle, so they're
    // not held to the app's ESM/TypeScript lint rules.
    "scripts/**",
  ]),
]);

export default eslintConfig;
