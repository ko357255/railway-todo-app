import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BackButton } from '~/components/BackButton';
import { AppButton } from '~/components/AppButton';
import { AppInput } from '~/components/AppInput';
import { Modal } from '~/components/Modal';
import './ListEditModal.css';
import { fetchLists, updateList, deleteList } from '~/store/list';
import { useId } from '~/hooks/useId';

export const ListEditModal = ({ listId, isOpen, onClose }) => {
  const id = useId();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const list = useSelector((state) =>
    state.list.lists?.find((list) => list.id === listId),
  ); // 選択中のTODOリスト

  useEffect(() => {
    if (list) {
      setTitle(list.title);
    }
  }, [list]);

  useEffect(() => {
    void dispatch(fetchLists());
  }, [listId]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      void dispatch(updateList({ id: listId, title }))
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
    [title, listId],
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      // キャンセルされたら処理を終わる
      return;
    }

    setIsSubmitting(true);

    void dispatch(deleteList({ id: listId }))
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
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="edit_list">
        <BackButton />
        <h2 className="edit_list__title">Edit List</h2>
        <p className="edit_list__error">{errorMessage}</p>
        <form className="edit_list__form" onSubmit={onSubmit}>
          <fieldset className="edit_list__form_field">
            <label htmlFor={`${id}-title`} className="edit_list__form_label">
              Name
            </label>
            <AppInput
              id={`${id}-title`}
              placeholder="Family"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              data-autofocus
            />
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
            <AppButton type="submit" disable={title === '' || isSubmitting}>
              Update
            </AppButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};
