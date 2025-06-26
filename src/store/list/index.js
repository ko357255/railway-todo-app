import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleThunkError } from "~/utils/handleThunkError";
import axios from "~/vendor/axios";

const initialState = {
  lists: null, // (store上の)TODOリストの配列
  current: null, // サイドバーで選択中のTODOリストID
  isLoading: false, // 読み込み中かどうか
};

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    // TODOリスト関連をリセット
    resetList: (state, _action) => {
      state.lists = null;
      state.current = null;
      state.isLoading = false;
    },
    // リストと、選択中リストをセット
    setList: (state, action) => {
      state.lists = action.payload;

      // リストが０より多いなら
      if (action.payload.length > 0) {
        // 選択中リストIDを0番目にする
        state.current = action.payload[0].id;
      } else {
        state.current = null;
      }
    },
    // 選択中リストIDをセット
    setCurrentList: (state, action) => {
      state.current = action.payload;
    },
    setListIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // TODOリストに追加
    addList: (state, action) => {
      const title = action.payload.title;
      const id = action.payload.id;

      state.lists.push({ title, id });
    },
    // TODOリストから削除
    removeList: (state, action) => {
      const id = action.payload.id;

      state.lists = state.lists.filter((list) => list.id !== id);

      // 選択中のリストだったら、0番目または未選択にする
      if (state.current === id) {
        state.current = state.lists[0]?.id || null;
      }
    },
    // TODOリストのタイトルを更新
    mutateList: (state, action) => {
      const id = action.payload.id;
      const title = action.payload.title;

      state.lists = state.lists.map((list) => {
        if (list.id === id) {
          list.title = title;
        }

        return list;
      });
    },
  },
});

export const {
  resetList,
  setList,
  setCurrentList,
  setListIsLoading,
  addList,
  removeList,
  mutateList,
} = listSlice.actions;

// TODOリストを取得するアクションクリエイター
// ↑のはずだけど、Actionは使ってない
export const fetchLists = createAsyncThunk(
  "list/fetchLists",
  async ({ force = false } = {}, thunkApi) => {
    const isLoading = thunkApi.getState().list.isLoading;

    if (!force && (thunkApi.getState().list.lists || isLoading)) {
      return;
    }

    if (thunkApi.getState().auth.token === null) {
      return;
    }

    thunkApi.dispatch(setListIsLoading(true));

    try {
      const res = await axios.get("/lists");
      thunkApi.dispatch(setList(res.data));
    } catch (e) {
      return handleThunkError(e, thunkApi);
    } finally {
      thunkApi.dispatch(setListIsLoading(false));
    }
  },
);

export const createList = createAsyncThunk(
  "list/createList",
  async ({ title }, thunkApi) => {
    try {
      const res = await axios.post("/lists", { title });
      thunkApi.dispatch(addList(res.data));

      return res.data.id;
    } catch (e) {
      return handleThunkError(e, thunkApi);
    }
  },
);

export const deleteList = createAsyncThunk(
  "list/deleteList",
  async ({ id }, thunkApi) => {
    try {
      await axios.delete(`/lists/${id}`);
      thunkApi.dispatch(removeList({ id }));
    } catch (e) {
      return handleThunkError(e, thunkApi);
    }
  },
);

export const updateList = createAsyncThunk(
  "list/updateList",
  async ({ id, title }, thunkApi) => {
    try {
      await axios.put(`/lists/${id}`, { title });
      thunkApi.dispatch(mutateList({ id, title }));
    } catch (e) {
      return handleThunkError(e, thunkApi);
    }
  },
);
