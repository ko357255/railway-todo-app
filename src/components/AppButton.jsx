import './AppButton.css';
import { Link } from 'react-router-dom';

export const AppButton = ({
  children, // 中の子要素がここに入る
  to, // Linkの場合は必須
  type = 'button',
  className = '',
  disable = false,
  onClick,
  ...props // 任意でさらに引数を取る
}) => {
  const buttonClassName = `app_button ${className}`;

  if (to) {
    // Link
    return (
      <Link to={to} className={buttonClassName} {...props}>
        {children}
      </Link>
    );
  } else {
    // button
    return (
      <button
        type={type}
        className={buttonClassName}
        disabled={disable}
        onClick={onClick}
        {...props} // propsを展開する
      >
        {children}
      </button>
    );
  }
};
