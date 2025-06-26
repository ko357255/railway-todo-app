import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import json from "eslint-plugin-json";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "src/components/digital-agency/**/*",
    "**/package.json",
    "**/package-lock.json",
    "**/.eslintrc.json",
    "src/components/HTMLComponentWithScript.jsx",
]), {
    extends: compat.extends("eslint:recommended", "plugin:react/recommended", "prettier"),

    plugins: {
        react,
        json,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            localStorage: "readonly",
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "no-console": "error",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
}]);