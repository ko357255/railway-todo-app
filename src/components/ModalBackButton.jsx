import { ChevronIcon } from '~/icons/ChevronIcon';
import './BackButton.css';

export const ModalBackButton = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className="back_button">
      <ChevronIcon className="back_button__icon" />
      Back
    </button>
  );
};
