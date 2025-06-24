import React, { useCallback, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogin } from "~/hooks/useLogin";
import { useId } from "~/hooks/useId";
import "./index.css";

const SignIn = () => {
  // ログイン中かどうか
  const auth = useSelector((state) => state.auth.token !== null);
  // ログイン処理を行う関数を作る
  const { login } = useLogin();

  // ランダムなID
  // <input id={`${id}-email`}> のように使われる
  // ↑このコンポーネントを複数置いても、idが被らないようにできる
  const id = useId();
  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState("");
  // ボタンを押しているかどうか
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState(""); // メルアド
  const [password, setPassword] = useState(""); // パスワード

  // フォームのボタンを押したときの処理
  const onSubmit = useCallback(
    // 依存関係によって関数を再定義する
    (event) => {
      event.preventDefault(); // フォーム送信をキャンセル

      setIsSubmitting(true); // ボタン押下 true

      // ログイン処理
      login({ email, password })
        .catch((err) => {
          // エラー時
          setErrorMessage(err.message); // エラーメッセージをセット
        })
        .finally(() => {
          // 完了時
          setIsSubmitting(false); // ボタン押下 false
        });
    },
    [email, password] // email,passwordの変化で関数を再定義する
  );

  // ログイン中なら
  if (auth) {
    // トップページに遷移する
    return <Navigate to="/" />;
  }

  return (
    <main className="signin">
      <h2 className="signin__title">Login</h2>
      {/* エラーメッセージ */}
      <p className="signin__error">{errorMessage}</p>
      {/* フォーム送信イベント */}
      <form className="signin__form" onSubmit={onSubmit}>
        <fieldset className="signin__form_field">
          <label htmlFor={`${id}-email`} className="signin__form_label">
            E-mail Address
          </label>
          <input

            id={`${id}-email`}
            type="email"
            autoComplete="email"
            className="app_input"
            value={email}
            onChange={(event) => setEmail(event.target.value)} // メルアドのセット
          />
        </fieldset>
        <fieldset className="signin__form_field">
          <label htmlFor={`${id}-password`} className="signin__form_label">
            Password
          </label>
          <input
            id={`${id}-password`}
            type="password"
            autoComplete="current-password"
            className="app_input"
            value={password}
            onChange={(event) => setPassword(event.target.value)} // パスワードのセット
          />
        </fieldset>
        <div className="signin__form_actions">
          {/* サインアップボタン */}
          <Link className="app_button" data-variant="secondary" to="/signup">
            Register
          </Link>
          <div className="signin__form_actions_spacer"></div>
          {/* ボタン押下中(isSubmitting)は送信できなくする */}
          <button type="submit" className="app_button" disabled={isSubmitting}>
            Login
          </button>
        </div>
      </form>
    </main>
  );
};

export default SignIn;
