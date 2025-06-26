import axios from 'axios';

/*
 * axiosに対してbaseURLおよびトークン無効時のリダイレクト処理を追加
 */
const axiosInstance = axios.create({
  // リクエストのベースURL（先頭に付く）
  baseURL: import.meta.env.VITE_RAILWAY_TODO_API_URL,
});

// レスポンスが返ってきたときの、共通処理
axiosInstance.interceptors.response.use(
  (response) => response, // 成功時
  (err) => {
    //エラー時
    // 401を返す場合はトークンを飛ばしてログイン画面に遷移
    // 401:アクセス権限エラー（認証情報不足など）
    if (err && err.response && err.response.status === 401) {
      // 認証情報を削除
      localStorage.removeItem('railway-todo-app__token');

      // NOTE: React Router経由ではなく、直接遷移させている。
      if (location.pathname !== '/signin') {
        // 強制的に飛ばす
        location.href = '/signin'; // 直接遷移のため、ページがリロードされる
      }
    }
    // エラーが起きたと認識させる（.catch()で受け取れる)
    return Promise.reject(err);
  },
);

/*
 * axiosからのexportではなく、こちらを使用する
 */
export default axiosInstance;
