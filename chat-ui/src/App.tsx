import { memo, useCallback, useEffect, useState } from 'react';
import './App.css';
import { Wellcome } from './Wellcome.tsx';
import { ChartWrapper } from './Chat.tsx';

const App = memo(function App() {
  const [state, setState] = useState<string>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    const login = localStorage.getItem("myLogin");
    if (!login) {
      setState('login');
    } else {
      setName(login);
      setState('chat');
    }
  }, [setState, setName]);

  const nextState = useCallback((state, name) => {
    switch (state) {
      case 'login':
        localStorage.removeItem("myLogin");
        break;
      case 'chat':
        localStorage.setItem("myLogin", name);
        break;
    }

    setName(name);
    setState(state);
  }, [setState, setName]);

  const logOut = useCallback(() => {
    nextState('login', null)
  }, [nextState]);

  let content;
  let header;

  if (state === 'login') {
    content = <Wellcome nextState={nextState} />;
    header = <>Sing In</>
  }

  if (state === 'chat') {
    content = <ChartWrapper name={name} />;
    header = <><span>Hi, {name}!</span> <a onClick={logOut}>Log out..</a></>;
  }

  return (
    <section className="app-container">
      <header>{header}</header>
      <section className="app-content">{content}</section>
    </section>
  );
});

export default App;
