import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "~/store/auth";

// ログイン関数を作る関数
// ↑ ログイン関数を直接返さないのは、依存関係に基づいて再定義したいから？
// ↑ useCallback() で包むことで、再定義を繰り返さないようにしている
export const useLogin = () => {
  // dispatch関数を作る
  const dispatch = useDispatch();
  // ページ遷移関数
  const navigate = useNavigate();

  // ログイン関数
  const handleLogin = useCallback(
    // email, passwordを受け取る
    async ({ email, password }) => {
      // await: 非同期で待つ
      await dispatch(
        // ログインのchunk関数を渡す
        login({
          email,
          password,
        }),
      ).unwrap(); // エラーならエラーで返すようにする

      // トップページに遷移する
      navigate("/");
    },
    [useDispatch], // Reduxの度に再定義
  );

  return {
    login: handleLogin, // ログイン関数を返す
  };
};
