import { memo, useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import { Wellcome } from './Wellcome.tsx';
import { Chat } from './Chat.tsx';

const socket = io({autoConnect: true});

const App = memo(function App() {
  const [state, setState] = useState<string>();
  const [login, setLogin] = useState<string>();

  const nextState = useCallback((state, login) => {
    switch (state) {
      case 'login':
        localStorage.removeItem("myLogin");
        break;
      case 'chat':
        localStorage.setItem("myLogin", login);
        break;
    }

    setLogin(login);
    setState(state);
  }, [setState, setLogin]);

  useEffect(() => {
    const login = localStorage.getItem("myLogin");
    if (!login) {
      nextState('login', null);
    } else {
      socket.emit('login', {
        login
      });

      nextState('chat', login);
    }
  }, [nextState]);

  const logInAttempt = useCallback((login: string) => {
    socket.emit('login', {
      login
    });

    nextState('chat', login);
  }, [nextState]);

  const logOut = useCallback(() => {
    nextState('login', null);

    socket.emit('logout', {});
  }, [nextState]);

  let content;
  let header;

  if (state === 'login') {
    content = <Wellcome onLogInAttempt={logInAttempt} />;
    header = <>Sing In</>
  }

  if (state === 'chat') {
    content = <Chat login={login} socket={socket} />;
    header = <><span>Hi, {login}!</span> <a onClick={logOut}>Log out..</a></>;
  }

  return (
    <section className="app-container">
      <header>{header}</header>
      <section className="app-content">{content}</section>
    </section>
  );
});

export default App;
