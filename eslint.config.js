import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import localRules from "./eslint-local-rules.cjs";
import pluginImport from "eslint-plugin-import";

export default [
  { ignores: ["**/node_modules/**", "**/tools/**", "**/packages/**", "**/legacy-v1/**", "**/coverage/**", "**/.expo/**", "**/test-reports/**", "**/_deprecated_src/**", "**/qdrant_storage/**"] },
  // Base configs
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Project-specific configs
  {
    files: [
      "apps/mobile/**/*.{ts,tsx,js,jsx}",
      "*.ts",
      "*.js"
    ],
    ignores: ["**/node_modules/**", "**/tools/**", "**/packages/**", "**/legacy-v1/**", "**/coverage/**", "**/.expo/**", "**/test-reports/**", "**/_deprecated_src/**", "**/qdrant_storage/**"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react: pluginReact,
      "local-rules": localRules,
      import: pluginImport
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      // So we don't fail on older TypeScript configs across vendored tools
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "local-rules/enforce-error-logger": "error"
    }
  },
];// Fixed node_modules/vrite exclusions - 2025-08-06T16:34:25Z
