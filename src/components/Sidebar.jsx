import { ListIcon } from '~/icons/ListIcon';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { PlusIcon } from '~/icons/PlusIcon';
import { useSelector, useDispatch } from 'react-redux';
import { useLogout } from '~/hooks/useLogout';
import { useEffect } from 'react';
import { fetchLists } from '~/store/list/index';

export const Sidebar = () => {
  const dispatch = useDispatch();
  // 現在のパスを受け取る (●●.com/[この部分])
  const { pathname } = useLocation();

  // storeからいろいろ取得
  // useSelector はstateが変わる度に再レンダリングされる
  const lists = useSelector((state) => state.list.lists);
  const activeId = useSelector((state) => state.list.current);
  const isLoggedIn = useSelector((state) => state.auth.token !== null);
  const userName = useSelector((state) => state.auth.user?.name);

  // リスト新規作成ページではリストをハイライトしない
  const shouldHighlight = !pathname.startsWith('/list/new'); // パスが '/list/new' ではない

  // ログアウト関数
  const { logout } = useLogout();

  // listsをstoreに入れる
  useEffect(() => {
    void dispatch(fetchLists());
  }, []);

  return (
    <div className="sidebar">
      {/* トップページのリンク */}
      <Link to="/">
        <h1 className="sidebar__title">Todos</h1>
      </Link>
      {isLoggedIn ? ( // ログイン中なら
        <>
          {/* リスト */}
          {lists && ( // lists があるなら
            <div className="sidebar__lists">
              <h2 className="sidebar__lists_title">Lists</h2>
              <ul className="sidebar__lists_items">
                {/* リストを繰り返し、リスト一覧 */}
                {lists.map((listItem) => (
                  <li key={listItem.id}>
                    <Link
                      // data-active(true/false)でcssのデザインを切り替える
                      // true: 選択中 false: 未選択
                      data-active={shouldHighlight && listItem.id === activeId}
                      to={`/lists/${listItem.id}`}
                      className="sidebar__lists_item"
                    >
                      {/* リストのアイコン */}
                      <ListIcon aria-hidden className="sidebar__lists_icon" />
                      {listItem.title}
                    </Link>
                  </li>
                ))}
                {/* 新規リストのボタン */}
                <li>
                  <Link to="/list/new" className="sidebar__lists_button">
                    <PlusIcon className="sidebar__lists_plus_icon" />
                    New List...
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className="sidebar__spacer" aria-hidden />
          <div className="sidebar__account">
            <p className="sidebar__account_name">{userName}</p>
            {/* ログアウト */}
            <button
              type="button"
              className="sidebar__account_logout"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        // ログイン中ではないなら
        <>
          <Link to="/signin" className="sidebar__login">
            Login
          </Link>
        </>
      )}
    </div>
  );
};
