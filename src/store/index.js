import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import { listSlice } from "./list";
import { taskSlice } from "./task";

// Reduxのstoreを定義
export const store = configureStore({
  reducer: {
    // それぞれのスライサー（stateとreducerをまとめたもの）を渡す
    auth: authSlice.reducer,
    list: listSlice.reducer,
    task: taskSlice.reducer,
  },
});
