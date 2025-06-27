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
  const inputClassName = `app_input ${className}`;

  if (type == 'textarea') {
    return (
      <textarea
        ref={ref}
        id={id}
        className={inputClassName}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    );
  } else {
    return (
      <input
        ref={ref}
        id={id}
        type={type}
        className={inputClassName}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...props}
      />
    );
  }
};
