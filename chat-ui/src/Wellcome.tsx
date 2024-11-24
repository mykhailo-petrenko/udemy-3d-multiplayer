import { useState, useCallback, memo, KeyboardEvent, ChangeEvent, FC } from 'react';

export interface WellcomeProps {
  onLogInAttempt: (name: string) => void;
}

export const Wellcome: FC<WellcomeProps> = memo(function Wellcome({onLogInAttempt}) {
  const [login, setLogin] = useState<string>('');

  const keyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  }, [setLogin]);

  const keyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && login.length > 0) {
      onLogInAttempt(login);
    }
  }, [login, onLogInAttempt]);

  return (
    <section className="wellcome-section">
      <label htmlFor="myLogin">Login:</label>
      <input
        type="text"
        id="myLogin"
        value={login}
        onChange={keyChange}
        onKeyDown={keyDown}
      />
    </section>
  );
});

