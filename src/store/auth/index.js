import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "~/vendor/axios";
import { handleThunkError } from "~/utils/handleThunkError";
import { resetTask } from "~/store/task";
import { resetList } from "~/store/list";

const initialState = {
  // NOTE: localStorageから直接取得している。SSR時にはこのままでは動かないので注意
  token: localStorage.getItem("railway-todo-app__token") || null,
  user: null,
  // NOTE: 2重ロードの回避用
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setToken, setUserIsLoading, setUser } = authSlice.actions;

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async ({ force = false } = {}, thunkApi) => {
    const isLoading = thunkApi.getState().auth.isLoading;
    const hasUser = thunkApi.getState().auth.user !== null;

    if (!force && (isLoading || hasUser)) {
      return;
    }

    if (thunkApi.getState().auth.token === null) {
      return;
    }

    thunkApi.dispatch(setUserIsLoading(true));

    try {
      const response = await axios.get(`/users`);
      thunkApi.dispatch(setUser(response.data));
    } catch (e) {
      return handleThunkError(e, thunkApi);
    } finally {
      thunkApi.dispatch(setUserIsLoading(false));
    }
  },
);

// loginのthunk関数
export const login = createAsyncThunk(
  // createAsyncThunk(): 非同期のthunk関数を作る

  "auth/login",
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
      localStorage.setItem("railway-todo-app__token", response.data.token);
      
      // dispatch(action)でstoreにトークンを保存する
      thunkApi.dispatch(setToken(response.data.token));

      // ついでにログインユーザーもstoreに保存する
      void thunkApi.dispatch(fetchUser());
    } catch (e) { // エラーの時の処理
      // チャンクエラーを返す
      return handleThunkError(e, thunkApi);
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
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

export const logout = createAsyncThunk(
  "auth/logout",
  async (_payload, thunkApi) => {
    // NOTE: ログアウト用のAPIは用意されてないので、トークンを削除するだけ
    localStorage.removeItem("railway-todo-app__token");
    thunkApi.dispatch(setToken(null));
    thunkApi.dispatch(setUser(null));

    // 他のステートをリセット
    thunkApi.dispatch(resetTask());
    thunkApi.dispatch(resetList());
  },
);
