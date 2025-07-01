import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fromZonedTime } from 'date-fns-tz';
import { AppButton } from './AppButton';
import './TaskCreateForm.css';
import { CheckIcon } from '~/icons/CheckIcon';
import { createTask } from '~/store/task';

export const TaskCreateForm = () => {
  const dispatch = useDispatch();

  // useRef: 直接DOM要素を取得する
  const refForm = useRef(null); // フォーム全体の要素

  // textarea のDOM要素が入る
  const [elemTextarea, setElemTextarea] = useState(null); // テキストエリア(タスク詳細)

  const [formState, setFormState] = useState('initial'); // フォーカス中かどうかなど

  const [title, setTitle] = useState(''); // タスクタイトル
  const [detail, setDetail] = useState(''); // タスクの詳細
  const [done, setDone] = useState(false); // タスク完了かどうか
  const [limitDate, setLimitDate] = useState(''); // 期限日付
  const [limitTime, setLimitTime] = useState(''); // 期限時間

  // タスクの完了と未完了を切り替える
  const handleToggle = useCallback(() => {
    setDone((prev) => !prev);
  }, []);

  // フォーカスされたとき
  const handleFocus = useCallback(() => {
    // useCallbackで再定義を防ぐことでパフォーマンスを上げる
    // けど、この関数はあんまり意味がない
    setFormState('focused');
  }, []);

  // フォーカスが外れた
  const handleBlur = useCallback(() => {
    if (title || detail) {
      // タイトルまたは詳細があるなら、外さない
      return;
    }

    setTimeout(() => {
      // フォーム内の要素がフォーカスされている場合は何もしない
      const formElement = refForm.current;
      if (formElement && formElement.contains(document.activeElement)) {
        return;
      }
      setFormState('initial'); // フォーカスを外す
      setDone(false); // 未完了にする
    }, 100);
  }, [title, detail]);

  // フォームをリセットする
  const handleDiscard = useCallback(() => {
    setTitle('');
    setDetail('');
    setFormState('initial');
    setDone(false);
    setLimitDate('');
    setLimitTime('');
  }, []);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setFormState('submitting');

      const taskPayload = { title, detail, done };

      // 日時と時間があるとき
      if (limitDate && limitTime) {
        // 日本時間をUTCに変更
        const utcLimit = fromZonedTime(
          `${limitDate}T${limitTime}:00`, // 日本時間
          'Asia/Tokyo', // 日本のタイムゾーン
        );
        // ISOの形式にフォーマットして渡す
        taskPayload.limit = utcLimit.toISOString();
      }

      void dispatch(createTask(taskPayload))
        .unwrap()
        .then(() => {
          handleDiscard();
        })
        .catch((err) => {
          alert(err.message);
          setFormState('focused');
        });
    },
    [title, detail, done, limitDate, limitTime],
  );

  // textarea(タスク詳細)の縦の自動調整
  useEffect(() => {
    if (!elemTextarea) {
      // テキストエリアがないなら、何もしない
      return;
    }

    const recalcHeight = () => {
      elemTextarea.style.height = 'auto'; // いったん auto にしないとバグるらしい
      // element.scrollHeight: コンテンツ（文字数など）が占める高さを返す
      elemTextarea.style.height = `${elemTextarea.scrollHeight}px`; // 高さ調整
    };

    // 入力されるたびに呼び出すイベントを追加
    elemTextarea.addEventListener('input', recalcHeight);
    recalcHeight();

    // useEffectのreturnは
    // 再実行される直前(またはアンマウント)に呼ばれる
    return () => {
      // イベントを削除
      elemTextarea.removeEventListener('input', recalcHeight);
    };
  }, [elemTextarea]);
  // textarea(DOM要素)が変化したら（入力の変化ではなく、要素自体の変化）

  return (
    <form
      ref={refForm}
      className="task_create_form"
      onSubmit={onSubmit}
      data-state={formState}
    >
      <div className="task_create_form__title_container">
        <button
          type="button"
          onClick={handleToggle}
          className="task_create_form__mark_button"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {done ? (
            <div
              className="task_create_form__mark____complete"
              aria-label="Completed"
            >
              <CheckIcon className="task_create_form__mark____complete_check" />
            </div>
          ) : (
            <div
              className="task_create_form__mark____incomplete"
              aria-label="Incomplete"
            ></div>
          )}
        </button>
        <input
          type="text"
          className="task_create_form__title"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={formState === 'submitting'}
        />
      </div>
      {formState !== 'initial' && (
        <div>
          <textarea
            // ref はDOM操作用に使う
            // ↓ は (DOM要素) => setElementTextarea(DOM要素) と同じ意味
            ref={setElemTextarea}
            rows={1}
            className="task_create_form__detail"
            placeholder="Add a description here..."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            // フォーカスが外れたときのイベント
            onBlur={handleBlur}
            disabled={formState === 'submitting'}
          />
          <div className="task_create_form_date">
            <input
              type="date"
              value={limitDate}
              onChange={(e) => setLimitDate(e.target.value)}
            />
            <input
              type="time"
              value={limitTime}
              onChange={(e) => setLimitTime(e.target.value)}
            />
          </div>
          <div className="task_create_form__actions">
            <AppButton
              type="button"
              data-variant="secondary"
              onBlur={handleBlur}
              onClick={handleDiscard}
              disabled={(!title && !detail) || formState === 'submitting'}
            >
              Discard
            </AppButton>
            <div className="task_create_form__spacer"></div>
            <AppButton
              type="submit"
              onBlur={handleBlur}
              disabled={!title || !detail || formState === 'submitting'}
            >
              Add
            </AppButton>
          </div>
        </div>
      )}
    </form>
  );
};
