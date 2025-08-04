import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import localRules from "eslint-plugin-local-rules";
import pluginImport from "eslint-plugin-import";

export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    plugins: { 
      "local-rules": localRules,
      "import": pluginImport
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "local-rules/enforce-error-logger": "error",
      
      // Alias enforcement rules
      "import/no-relative-parent-imports": ["error", { maxDepth: 1 }],
      "import/no-relative-packages": "error",
      "import/no-absolute-path": "error",
      "import/no-internal-modules": [
        "error",
        {
          allow: [
            "@shared/*",
            "@components/*",
            "@hooks/*",
            "@utils/*"
          ]
        }
      ]
    }
  }
];