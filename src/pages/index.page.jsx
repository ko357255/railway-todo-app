import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLists } from "~/store/list/index";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 選択中のリストID
  const currentListId = useSelector((state) => state.list.current);

  useEffect(() => {
    // リストを取得
    dispatch(fetchLists());
  }, []);

  useEffect(() => {
    // 選択中リストIDがあるなら
    if (currentListId) {
      // そのパスに飛ばす
      navigate(`/lists/${currentListId}`);
    }
  }, [currentListId]);

  return <div></div>;
};

export default Home;
