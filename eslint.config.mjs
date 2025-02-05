// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import next from "eslint-config-next";

export default [
  js.configs.recommended,
  ts.configs.recommended,
  next,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json", // Ensure TypeScript is being used correctly
      },
    },
    rules: {
      // Add custom rules here if needed
    },
  },
];
