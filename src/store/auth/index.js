import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '~/vendor/axios';
import { handleThunkError } from '~/utils/handleThunkError';
import { resetTask } from '~/store/task';
import { resetList } from '~/store/list';

// state の初期状態を定義
const initialState = {
  // NOTE: localStorageから直接取得している。SSR時にはこのままでは動かないので注意
  token: localStorage.getItem('railway-todo-app__token') || null,
  user: null,
  // NOTE: 2重ロードの回避用
  isLoading: false,
};


// authのスライスを定義
// スライス: 状態(state) と 変化を起こす (reducer) をひとまとめにしたもの
export const authSlice = createSlice({
  name: 'auth', // action名 { type: 'auth/〇〇 '} になる
  initialState, // 初期状態
  // 状態変化を起こす関数
  reducers: {
    // reduce関数
    // func(state: storeの状態が入る, action: アクションが入る)

    // isLoading を受け取った値に変更する
    // 例) { type: 'auth/setUserIsLoading' payload: true }
    setUserIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // token を受け取った値に変更する
    setToken: (state, action) => {
      state.token = action.payload;
    },
    // user を受け取った値に変更する
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// スライスを元に、関数を定義
// authSlice.actions には reducers で定義した関数に対応する
// アクションクリエイター関数が入っている
export const { setToken, setUserIsLoading, setUser } = authSlice.actions;

// アクションクリエイター関数はこんな風に使える
// dispatch(func(payload));

// ログインユーザーをstoreにセットするchunk関数
// createAsyncThunk: アクションクリエイター
export const fetchUser = createAsyncThunk(
  'auth/fetchUser', // action名
  // ↑をもとに、３つのアクションを作ってくれる
  // そのActionは、スライサーのextraReducersで受け取る
  // auth/fetchUser/pending 始まった時
  // auth/fetchUser/fulfilled 成功してreturnしたとき
  // auth/fetchUser/rejected エラーになった時
  // だけど、今回は利用してない？
  // createAsyncThunkを使う意味ある？

  // force: ログインデータが既にあっても、取得するかどうか？
  async ({ force = false } = {}, thunkApi) => {
    // ログインデータを取得中かどうか
    const isLoading = thunkApi.getState().auth.isLoading;
    // ログインデータが既にあるかどうか
    const hasUser = thunkApi.getState().auth.user !== null;

    // データ取得中 または ログインデータ取得済み なら
    if (!force && (isLoading || hasUser)) {
      // 処理を終わる
      return;
    }

    // ログイン中ではないなら
    if (thunkApi.getState().auth.token === null) {
      // 処理を終わる
      return;
    }

    // ローディングをtrueにする
    thunkApi.dispatch(setUserIsLoading(true));

    try {
      // ユーザーのデータを取得（※App.jsxで認証情報を付加して）
      const response = await axios.get(`/users`);
      // ログインデータをreduxに渡す
      thunkApi.dispatch(setUser(response.data));
    } catch (e) {
      // エラー
      return handleThunkError(e, thunkApi);
    } finally {
      // 処理が終わったら、ローディングをfalseに
      thunkApi.dispatch(setUserIsLoading(false));
    }
  },
);

// loginのthunk関数
export const login = createAsyncThunk(
  // createAsyncThunk(): 非同期のthunk関数を作る

  'auth/login', // action.typeの値
  async (payload, thunkApi) => {
    // payload: 関数(login)が受け取る関数 login({email, password})
    // thunkAPI: Reduxとやり取りするやつ

    try {
      // 渡された引数から、email,passowrd を取り出す
      const { email, password } = payload;

      // サインインAPI、アクセストークンを返す
      // サーバーを通信する（fetachみたいなもん）
      // fetachとの違い: 勝手にjsonにしてくれる、エラー処理が簡単
      // index.jsx でaxiosリクエストに認証情報を付与してるから、fetach()だとダメ
      const response = await axios.post(`/signin`, {
        // リクエストボディ
        email,
        password,
      });

      // ローカルストレージに、貰ったトークンを保管する
      localStorage.setItem('railway-todo-app__token', response.data.token);

      // dispatch(action)でstoreにトークンを保存する
      thunkApi.dispatch(setToken(response.data.token));

      // ついでにログインユーザーもstoreに保存する
      void thunkApi.dispatch(fetchUser());
    } catch (e) {
      // エラーの時の処理
      // チャンクエラーを返す
      return handleThunkError(e, thunkApi);
    }
  },
);

// サインアップ
export const signup = createAsyncThunk(
  'auth/signup', // action名 'auth/signup/〇〇'
  async (payload, thunkApi) => {
    try {
      const { email, password, name } = payload;
      const response = await axios.post(`/users`, {
        email,
        password,
        name,
      });
      thunkApi.dispatch(setToken(response.data.token));
      void thunkApi.dispatch(fetchUser());
    } catch (e) {
      return handleThunkError(e, thunkApi);
    }
  },
);

// ログアウト
export const logout = createAsyncThunk(
  'auth/logout',
  async (_payload, thunkApi) => {
    // NOTE: ログアウト用のAPIは用意されてないので、トークンを削除するだけ
    localStorage.removeItem('railway-todo-app__token');
    thunkApi.dispatch(setToken(null));
    thunkApi.dispatch(setUser(null));

    // 他のステートをリセット
    thunkApi.dispatch(resetTask());
    thunkApi.dispatch(resetList());
  },
);
