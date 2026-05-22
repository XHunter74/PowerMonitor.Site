// @ts-check
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const unusedImports = require("eslint-plugin-unused-imports");
const eslintPluginPrettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    ignores: ["projects/**/*", "**/node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
      prettierConfig,
    ],
    plugins: {
      "unused-imports": unusedImports,
      prettier: eslintPluginPrettier,
    },
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ["src/tsconfig.app.json", "tsconfig.spec.json"],
        createDefaultProgram: true,
      },
    },
    rules: {
      "@angular-eslint/prefer-standalone": "off",
      "prettier/prettier": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "unused-imports/no-unused-imports": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  }
);
