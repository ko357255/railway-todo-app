import { useState, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { parseISO, isPast, intervalToDuration } from 'date-fns';
import { format } from 'date-fns-tz'; // tzはタイムゾーンを操作できる
import { PencilIcon } from '~/icons/PencilIcon';
import { CheckIcon } from '~/icons/CheckIcon';
import { updateTask } from '~/store/task';
import { TaskEditModal } from './TaskEditModal';
import './TaskItem.css';

export const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const { listId } = useParams();
  const { id, title, detail, done, limit } = task;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formatLimit = (limit) => {
    if (!limit) return { limitStr: null, remainingStr: null };

    // parseISO(): new Date() と同じだけど、ISO形式ではないとエラー
    const limitDate = parseISO(limit); // UTC時間

    // date-fns-tz format(): タイムゾーンを指定してフォーマット
    const limitStr = format(limitDate, 'yyyy/MM/dd HH:mm', {
      timeZone: 'Asia/Tokyo',
    });

    // isPast(): 現在の日付よりも前かどうか
    if (isPast(limitDate)) {
      return { limitStr, remainingStr: '期限を過ぎています' };
    }

    // intervalToDuration(): 経過時間をオブジェクトで返す
    const duration = intervalToDuration({
      start: Date.now(),
      end: limitDate,
    });

    let remainingStr = '残り';
    if (duration.days > 0) remainingStr += `${duration.days}日`;

    if (duration.hours > 0) remainingStr += `${duration.hours}時間`;

    if (duration.minutes > 0) remainingStr += `${duration.minutes}分`;

    if (duration.days === 0 && duration.hours === 0 && duration.minutes === 0) {
      remainingStr += 'わずか';
    }
    remainingStr += 'です';

    return {
      limitStr,
      remainingStr,
    };
  };

  useEffect(() => {}, []);

  const { limitStr, remainingStr } = formatLimit(limit);

  // タスクの完了ボタン
  const handleToggle = useCallback(() => {
    setIsSubmitting(true);
    // 現在の状態を反転させてアップデートする
    void dispatch(updateTask({ id, done: !done })).finally(() => {
      setIsSubmitting(false);
    });
  }, [id, done]);

  return (
    <>
      <div className="task_item">
        <div className="task_item__title_container">
          {/* 完了ボタン */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isSubmitting}
            className="task__item__mark_button"
          >
            {done ? ( // 完了済
              <div
                className="task_item__mark____complete"
                aria-label="Completed"
              >
                <CheckIcon className="task_item__mark____complete_check" />
              </div>
            ) : (
              // 未完了
              <div
                className="task_item__mark____incomplete"
                aria-label="Incomplete"
              ></div>
            )}
          </button>
          <div className="task_item__title" data-done={done}>
            {/* 完了済みならデザインをCSSで変える */}
            {title}
          </div>
          <div aria-hidden className="task_item__title_spacer"></div>
          <div
            className="task_item__title_action"
            onClick={() => setIsOpen(true)}
          >
            <PencilIcon aria-label="Edit" />
          </div>
        </div>
        <div className="task_item__detail">{detail}</div>
        {limit && (
          <div className="task_item__limit">
            <div>
              {limitStr} {done ? null : remainingStr}
            </div>
          </div>
        )}
      </div>

      {/* タスク編集モーダル */}
      <TaskEditModal
        task={task}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
