import './AppButton.css';

export const AppButton = ({ children, type = 'button' }) => {
  return <button className="app_button">{children}</button>;
};
