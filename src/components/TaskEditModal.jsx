import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { parseISO } from 'date-fns';
import { fromZonedTime, format } from 'date-fns-tz';
import { ModalBackButton } from '~/components/ModalBackButton';
import { AppButton } from '~/components/AppButton';
import { AppInput } from '~/components/AppInput';
import { Modal } from '~/components/Modal';
import './TaskEditModal.css';
import { setCurrentList } from '~/store/list';
import { fetchTasks, updateTask, deleteTask } from '~/store/task';
import { useId } from '~/hooks/useId';

export const TaskEditModal = ({ task, isOpen, onClose }) => {
  const id = useId();
  const { listId } = useParams();
  const taskId = task.id;
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);
  const [limitDate, setLimitDate] = useState('');
  const [limitTime, setLimitTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // タスクの初期値をセット
  useEffect(() => {
    if (task) {
      setErrorMessage('');
      setTitle(task.title);
      setDetail(task.detail);
      setDone(task.done);
      if (task.limit) {
        const utcDate = parseISO(task.limit);
        setLimitDate(format(utcDate, 'yyyy-MM-dd', { timeZone: 'Asia/Tokyo' }));
        setLimitTime(format(utcDate, 'HH:mm', { timeZone: 'Asia/Tokyo' }));
      } else {
        setLimitDate('');
        setLimitTime('');
      }
    }
  }, [task]);

  useEffect(() => {
    void dispatch(setCurrentList(listId));
    void dispatch(fetchTasks());
  }, [listId, dispatch]); // dispatchを含めるべきらしい

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      const taskPayload = { id: taskId, title, detail, done, limit: null };
      if (limitDate && limitTime) {
        const utcLimit = fromZonedTime(
          `${limitDate}T${limitTime}:00`,
          'Asia/Tokyo',
        );
        taskPayload.limit = utcLimit.toISOString();
      }

      dispatch(updateTask(taskPayload))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch((err) => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [title, taskId, detail, done, limitDate, limitTime, dispatch, onClose],
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsSubmitting(true);

    void dispatch(deleteTask({ id: taskId }))
      .unwrap()
      .then(() => {
        navigate(`/`);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [taskId, dispatch, onClose]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="edit_task">
        <ModalBackButton onClick={onClose} />
        <h2 className="edit_task__title">Edit Task</h2>
        <p className="edit_task__error">{errorMessage}</p>
        <form className="edit_task__form" onSubmit={onSubmit}>
          <fieldset className="edit_task__form_field">
            <label htmlFor={`${id}-title`} className="edit_task__form_label">
              Title
            </label>
            <AppInput
              id={`${id}-title`}
              placeholder="Buy some milk"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              data-autofocus // 初期フォーカス
            />
          </fieldset>
          <fieldset className="edit_task__form_field">
            <label htmlFor={`${id}-detail`} className="edit_task__form_label">
              Description
            </label>
            <AppInput
              type="textarea"
              id={`${id}-detail`}
              placeholder="Blah blah blah"
              rows="3"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
            />
          </fieldset>
          <fieldset aria-labelledby={`${id}-limit`}>
            <label
              htmlFor={`${id}-limit-date`}
              className="edit_task__form_label"
            >
              limit
            </label>
            <div className="edit_task__form_date">
              <input
                id={`${id}-limit-date`}
                type="date"
                value={limitDate}
                onChange={(e) => setLimitDate(e.target.value)}
              />
              <input
                id={`${id}-limit-time`}
                type="time"
                value={limitTime}
                onChange={(e) => setLimitTime(e.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className="edit_task__form_field">
            <label htmlFor={`${id}-done`} className="edit_task__form_label">
              Is Done
            </label>
            <div>
              <input
                id={`${id}-done`}
                type="checkbox"
                checked={done}
                onChange={(event) => setDone(event.target.checked)}
              />
            </div>
          </fieldset>
          <div className="edit_task__form_actions">
            <AppButton data-variant="secondary" onClick={onClose}>
              Cancel
            </AppButton>
            <div className="edit_task__form_actions_spacer"></div>
            <AppButton
              type="button"
              className="edit_task__form_actions_delete"
              disabled={isSubmitting}
              onClick={handleDelete}
            >
              Delete
            </AppButton>
            <AppButton type="submit" disabled={title == '' || detail == '' || isSubmitting}>
              Update
            </AppButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};
