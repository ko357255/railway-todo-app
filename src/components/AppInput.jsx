import './AppInput.css';

export const AppInput = (
  {
    id,
    name,
    type = 'text',
    autoComplete,
    className = '',
    value,
    onChange,
    placeholder = '',
    ...props
  },
  ref, // DOM要素を直接操作するref
) => {
  return (
    <input
      ref={ref}
      id={id}
      type={type}
      className={`app_input ${className}`}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      {...props}
    />
  );
};
