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
    // チェック対象外ファイル
    "dist/",
    "**/package.json",
    "**/package-lock.json",
    "**/.eslintrc.json",
    "src/components/HTMLComponentWithScript.jsx",
]), {
    // ルールセットを継承する
    extends: compat.extends(
        "eslint:recommended", // eslintの基本的なルールセット
        "plugin:react/recommended", // eslint-reactの推奨ルールセット
        "prettier" // prettierのフォーマットルールとの競合しないよう、フォーマットを無効化
    ),

    // ESlintで使用するプラグイン
    plugins: {
        react,
        json,
    },

    // コードの解析オプション
    languageOptions: {
        globals: {
            ...globals.browser, // ブラウザ環境
            localStorage: "readonly", // ローカルストレージを認識させる
        },
    },

    // プラグインの設定
    settings: {
        react: {
            version: "detect", // Reactのバージョンを自動検出する
        },
    },

    // 個別ルール
    rules: {
        "no-console": "error", // console.log()を禁止
        "react/jsx-uses-react": "off", // JSXではReactのインポートがなくてもOK
        "react/react-in-jsx-scope": "off", // 同上
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // 未使用の変数を禁止(_は許可)
        "react/jsx-uses-vars": "error", // JSX内でも未使用の変数をエラーにする
        "react/prop-types": "off", // prop-typesをオフ
        "eqeqeq": "error", // 厳密等価演算を強制
        "no-else-return": ["error", { "allowElseIf": false }] // 不要なelseを禁止
    },
}]);