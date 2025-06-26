import './AppButton.css';

export const AppButton = ({
  children, // 中の子要素がここに入る
  type = 'button',
  className = '',
  disable = false,
  onClick,
  ...props // 任意でさらに引数を取る
}) => {
  return (
    <button
      type={type}
      className={`app_button ${className}`}
      disabled={disable}
      onClick={onClick}
      {...props} // propsを展開する
    >
      {children}
    </button>
  );
};
