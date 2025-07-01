import { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppButton } from '~/components/AppButton';
import { AppInput } from '~/components/AppInput';
import './index.css';
import { useSignup } from '~/hooks/useSignup';
import { useId } from '~/hooks/useId';

const SignUp = () => {
  const auth = useSelector((state) => state.auth.token !== null);

  const id = useId(); // ランダムなID
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ボタンを押下しているかどうか

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { signup } = useSignup(); // サインアップ関数を作る

  // フォームの送信イベント
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true); // ボタン押下 true

      // サインアップ処理
      signup({ email, name, password })
        .catch((err) => {
          setErrorMessage(`サインアップに失敗しました: ${err.message}`);
        })
        .finally(() => {
          setIsSubmitting(false); // ボタン押下 false
        });
    },
    // email,name,passwordが変わるたびに
    // 再定義する
    [email, name, password],
  );

  if (auth) {
    // ログイン中ならトップページへ遷移
    return <Navigate to="/" />;
  }

  return (
    <main className="signup">
      <h2 className="signup__title">Register</h2>
      <p className="signup__error">{errorMessage}</p>
      <form className="signup__form" onSubmit={onSubmit}>
        <fieldset className="signup__form_field">
          <label htmlFor={`${id}-email`} className="signup__form_label">
            E-mail Address
          </label>
          <AppInput
            id={`${id}-email`}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </fieldset>
        <fieldset className="signup__form_field">
          <label
            htmlFor={`${id}-name`}
            autoComplete="name"
            className="signup__form_label"
          >
            Name
          </label>
          <AppInput
            id={`${id}-name`}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </fieldset>
        <fieldset className="signup__form_field">
          <label
            htmlFor={`${id}-password`}
            autoComplete="new-password"
            className="signup__form_label"
          >
            Password
          </label>
          <AppInput
            id={`${id}-password`}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </fieldset>
        <div className="signup__form_actions">
          <AppButton data-variant="secondary" to="/signin">
            Login
          </AppButton>
          <div className="signup__form_actions_spacer"></div>
          {/* ボタン押下中は送信不可にする */}
          <AppButton type="submit" disabled={isSubmitting}>
            Register
          </AppButton>
        </div>
      </form>
    </main>
  );
};

export default SignUp;
