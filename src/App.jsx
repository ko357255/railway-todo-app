import { useDispatch } from "react-redux";
import { Router } from "./routes/Router";
import { useEffect } from "react";
import { fetchUser } from "~/store/auth/index";

function App() {
  // reduxを理解する
  // 何ができる: 共通データを、どこのコンポーネントからでも取れるようにする。
  // store: 共通のデータの保管庫
  // state: ↑に入ってるデータの値（money: 100 みたいな)

  // Action: state↑ をこう変更して！という命令のオブジェクト
  //         { type: 'お金増やして', payload: 10 } → stateが {money: 110} になる

  // dispatch: Action↑ を Reducer↓ に運ぶ役割
  // Reducer : dispatch↑ が運んでくれた Action を元に、stateを変更する役割

  // dispatch関数を作る
  const dispatch = useDispatch();

  // 初回描写時に、ログインデータを貰う
  // ログインデータを取得し、「store」に保存する
  useEffect(() => {
    // fetchUser(): ログイン中のユーザーのデータを取得し、dispatchに渡す

    // 普通の使い方の場合: dispatch(action): action を渡してデータを変更する
    // 非同期処理(API)の場合: dispatch(async(dispatch) =>{}): APIが取れてから action を渡してデータを変更する 
    void dispatch(fetchUser());
  }, []);

  return (
    <div className="App">
      {/* Routerに飛ばす */}
      <Router />
    </div>
  );
}

export default App;
