import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "~/store/auth";

// ログイン関数を作る関数
export const useLogin = () => {
  // Reduxにデータを送る関数
  const dispatch = useDispatch();
  // ページ遷移関数
  const navigate = useNavigate();

  // ログイン関数
  const handleLogin = useCallback(
    // email, passwordを受け取る
    async ({ email, password }) => {
      // await: 非同期で待つ
      await dispatch(
        login({
          email,
          password,
        }),

      ).unwrap(); // エラーならエラーで返すようにする

      // トップページに遷移する
      navigate.push("/");
    },
    [useDispatch], // Reduxの度に再定義
  );

  return {
    login: handleLogin, // ログイン関数を返す
  };
};
