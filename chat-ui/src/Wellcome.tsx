import { useState, useCallback, memo, KeyboardEvent, ChangeEvent, FC } from 'react';

export interface WellcomeProps {
  nextState: (state: string, name: string) => void;
}

export const Wellcome: FC<WellcomeProps> = memo(function Wellcome({nextState}) {
  const [name, setName] = useState<string>('');

  const keyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, [setName]);

  const keyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && name.length > 0) {
      nextState('chat', name);
    }
  }, [name, nextState]);

  return (
    <section className="wellcome-section">
      <label htmlFor="myLogin">Login:</label>
      <input
        type="text"
        id="myLogin"
        value={name}
        onChange={keyChange}
        onKeyDown={keyDown}
      />
    </section>
  );
});

