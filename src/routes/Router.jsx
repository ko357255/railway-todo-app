import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import { Sidebar } from '~/components/Sidebar';
import Home from '~/pages/index.page';
import NotFound from '~/pages/404';
import SignIn from '~/pages/signin/index.page';
import NewList from '~/pages/list/new/index.page';
import SignUp from '~/pages/signup/index.page';
import ListIndex from '~/pages/lists/[listId]/index.page';

export const Router = () => {
  // 「store」からログイン中かどうかを受け取る
  // useSelector: 「store」のデータから必要なものを受け取る関数？
  // (state) には全体のデータが入る
  // state.auth.token: アクセストークン
  const auth = useSelector((state) => state.auth.token !== null);

  return (
    <BrowserRouter>
      {/* BrowserRouter の中では Routeで切り替えれるようになる */}
      {/* サイドバー (共通部分) */}
      <Sidebar />
      <div className="main_content">
        {/* 中のRouteから一つだけ選ばれる */}
        <Routes>
          {/* サインイン画面 */}
          <Route path="/signin" element={<SignIn />} replace />
          {/* サインアップ画面 */}
          <Route path="/signup" element={<SignUp />} />

          {/* ログイン中なら */}
          {auth ? (
            <>
              {/* Home画面 */}
              <Route path="/" element={<Home />} />
              {/* リスト画面（IDに基づく) */}
              <Route path="/lists/:listId" element={<ListIndex />} />
              {/* リスト作成画面 */}
              <Route path="/list/new" element={<NewList />} />
            </>
          ) : (
            // ログイン中ではないのに、「/」に来たら
            // サインイン画面 (履歴無し)
            <Route path="/" element={<Navigate to="/signin" replace />} />
          )}
          {/* どれにも当てはまらなかったら */}
          {/* NotFound画面 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
