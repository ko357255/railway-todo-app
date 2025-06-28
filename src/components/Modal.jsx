import FocusLock from 'react-focus-lock';
import './Modal.css';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // isOpenがfalseなら何も表示しない

  return (
    // フォーカスを閉じ込める
    <FocusLock>
      {/* クリック時に渡された onClose を実行する */}
      <div className="modal_overlay" onClick={onClose}>
        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </FocusLock>
  );
};
