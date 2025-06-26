import './AppButton.css';

export const AppButton = ({
    children
}) => {
  return (
    <button
      className="app_button"
    >
      {children}
    </button>
  );
}