import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/index";
import axios from "~/vendor/axios";

// axiosでサーバーにリクエストを送ったとき（GETとかPOSTとか）
axios.interceptors.request.use((config) => {
  // 「store」のデータから、アクセストークン(証明書みたいな)を取得
  const token = store.getState().auth.token;
  // もしトークンがあるなら
  if (token) {
    // リクエストのヘッダーに、トークンを付与する
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// ↑エントリーポイントで行うと、
// 全てのリクエストにaxiosを付けれるから、ここに書いてる?

// Provider(redux) = 状態管理、propsでデータを渡さずにどこでも共有できるみたいな?
// 「store」はメモリ上のオブジェクトで、ブラウザを閉じると消える

// axios = サーバーとの通信ツール、リクエストを送る前に共通の処理を作ったりできる

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* アプリ全体に「store」の情報を渡す（これでどこでも使える） */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
