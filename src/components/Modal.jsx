import FocusLock from 'react-focus-lock';
import './Modal.css';

export const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null; // isOpenがfalseなら何も表示しない

  return (
    // フォーカスを閉じ込める
    <FocusLock returnFocus>
      {/* 黒背景 */}
      {/* クリック時に渡された onClose を実行し、isOpenをfalseにする */}
      <div className="modal_overlay" onClick={onClose}>
        {/* モーダル内部はクリックイベントを無効化する */}
        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </FocusLock>
  );
};
