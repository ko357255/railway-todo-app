import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { TaskItem } from '~/components/TaskItem';
import { TaskCreateForm } from '~/components/TaskCreateForm';
import { setCurrentList } from '~/store/list';
import { fetchTasks } from '~/store/task';
import './index.css';

const ListIndex = () => {
  const dispatch = useDispatch();
  const { listId } = useParams(); // URLに渡されたlistId

  const isLoading = useSelector(
    (state) => state.task.isLoading || state.list.isLoading,
  ); // 読み込み中かどうか

  const tasks = useSelector((state) => state.task.tasks); // タスク
  const listName = useSelector((state) => {
    const currentId = state.list.current;
    const list = state.list.lists?.find((list) => list.id === currentId);
    return list?.title;
  }); // 選択中のTODOリストの名前
  const incompleteTasksCount = useSelector((state) => {
    return state.task.tasks?.filter((task) => !task.done).length;
  }); // 未完了のタスクの数

  useEffect(() => {
    dispatch(setCurrentList(listId)); // 選択中IDをセット
    dispatch(fetchTasks()).unwrap(); // タスクを取得する
  }, [listId]);

  // 読み込み中なら何も表示しない
  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="tasks_list">
      <div className="tasks_list__title">
        {/* リスト名 */}
        {listName}
        {/* 未完了のタスク数 */}
        {incompleteTasksCount > 0 && (
          <span className="tasks_list__title__count">
            {incompleteTasksCount}
          </span>
        )}
        <div className="tasks_list__title_spacer"></div>
        {/* リスト編集ボタン */}
        <Link to={`/lists/${listId}/edit`}>
          <button className="app_button">Edit...</button>
        </Link>
      </div>
      <div className="tasks_list__items">
        {/* タスク作成フォーム */}
        <TaskCreateForm />
        {/* タスク配列を繰り返して、タスクを設置 */}
        {tasks?.map((task) => {
          return <TaskItem key={task.id} task={task} />;
        })}

        {/* もしタスク数が０なら */}
        {tasks?.length === 0 && (
          // 無しと表示
          <div className="tasks_list__items__empty">No tasks yet!</div>
        )}
      </div>
    </div>
  );
};

export default ListIndex;
