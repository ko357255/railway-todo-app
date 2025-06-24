import { useDispatch } from "react-redux";
import { Router } from "./routes/Router";
import { useEffect } from "react";
import { fetchUser } from "~/store/auth/index";

function App() {
  // reduxの「store」からデータを貰うために使う
  const dispatch = useDispatch();

  // 初回描写時に、ログインデータを貰う
  useEffect(() => {
    // ログインデータを取得し、「store」に保存する
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
