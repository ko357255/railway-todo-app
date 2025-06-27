import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BackButton } from '~/components/BackButton';
import { AppButton } from '~/components/AppButton';
import './index.css';
import { setCurrentList } from '~/store/list';
import { fetchTasks, updateTask, deleteTask } from '~/store/task';
import { useId } from '~/hooks/useId';
import { AppInput } from '~/components/AppInput';

const EditTask = () => {
  const id = useId();

  const { listId, taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);
  const [limitDate, setLimitDate] = useState('');
  const [limitTime, setLimitTime] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = useSelector((state) =>
    state.task.tasks?.find((task) => task.id === taskId),
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDetail(task.detail);
      setDone(task.done);

      if (task.limit) {
        setLimitDate(task.limit.substring(0, 10));
        setLimitTime(task.limit.substring(11, 16));
      }
    }
  }, [task]);

  useEffect(() => {
    void dispatch(setCurrentList(listId));
    void dispatch(fetchTasks());
  }, [listId]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      const taskPayload = { id: taskId, title, detail, done, limit: null };

      if (limitDate && limitTime) {
        taskPayload.limit = `${limitDate}T${limitTime}:00Z`;
      }

      void dispatch(updateTask(taskPayload))
        .unwrap()
        .then(() => {
          navigate(`/lists/${listId}`);
        })
        .catch((err) => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [title, taskId, listId, detail, done, limitDate, limitTime],
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
  }, [taskId]);

  return (
    <main className="edit_list">
      <BackButton />
      <h2 className="edit_list__title">Edit Task</h2>
      <p className="edit_list__error">{errorMessage}</p>
      <form className="edit_list__form" onSubmit={onSubmit}>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-title`} className="edit_list__form_label">
            Title
          </label>
          <AppInput
            id={`${id}-title`}
            placeholder="Buy some milk"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-detail`} className="edit_list__form_label">
            Description
          </label>
          <AppInput
            type="textarea"
            id={`${id}-detail`}
            placeholder="Blah blah blah"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
          />
        </fieldset>
        <fieldset aria-labelledby={`${id}-limit`}>
          <div id={`${id}-limit`} className="edit_list__form_label">
            limit
          </div>
          <div className="edit_task__form_date">
            <input
              id={`${id}-limit`}
              type="date"
              value={limitDate}
              onChange={(e) => setLimitDate(e.target.value)}
            />
            <input
              id={`${id}-limit`}
              type="time"
              value={limitTime}
              onChange={(e) => setLimitTime(e.target.value)}
            />
          </div>
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-done`} className="edit_list__form_label">
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
        <div className="edit_list__form_actions">
          <AppButton to="/" data-variant="secondary">
            Cancel
          </AppButton>
          <div className="edit_list__form_actions_spacer"></div>
          <AppButton
            type="button"
            className="edit_list__form_actions_delete"
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </AppButton>
          <AppButton type="submit" disabled={isSubmitting}>
            Update
          </AppButton>
        </div>
      </form>
    </main>
  );
};

export default EditTask;
