import { ChangeEvent, FC, KeyboardEvent, memo, useCallback, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { JSX } from 'react/jsx-runtime';
import { Message } from './Message.tsx';

export interface ChatProps {
  login: string;
  socket: Socket;
}

let history: JSX.Element[] = [];

export const Chat: FC<ChatProps> = memo(function Chat({login, socket}) {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState(null);
  const [logins, setLogins] = useState(null);

  useEffect(() => {
    const chatRoomListener = ({id, time, login, message}) => {
      history = [
        ...history,
        <Message id={id} time={time} login={login} message={message} key={id} />,
      ];

      setMessages(history);
    };

    const onlineListener = ({logins}) => {
      setLogins(logins);
    };

    const historyListener = ({messages: historyMessages}) => {
      setMessages([]);

      history = historyMessages.map(({id, time, login, message}) => <Message id={id} time={time} login={login} message={message} key={id} />);

      setMessages(history);
    };

    socket.on('online', onlineListener);
    socket.on('history', historyListener);
    socket.on('chat', chatRoomListener);

    return () => {
      socket.off('chat', chatRoomListener);
      socket.off('history', historyListener);
      socket.off('online', onlineListener);
    };
  }, [setMessages, setLogins]);

  const sendMessage = useCallback((message) => {
    socket.emit('message', {
      message: message,
      login: login,
    });
    setMessage('');
  }, [login, setMessage]);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, [setMessage]);

  const keyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && message.length > 0) {
      sendMessage(message);
    }
  }, [message, sendMessage]);

  const loginsList = logins?.map(({login}, i) => {
    return <li key={`${login}-${i}`}>{login}</li>
  });

  console.log(loginsList)

  return (
    <section className="app-chat">
      <article>
        <section>
          <div>
            {messages}
          </div>
        </section>
        <footer>
          <input
            type="text"
            value={message}
            onChange={onChange}
            onKeyDown={keyDown}
          />
        </footer>
      </article>
      <aside>
        <ul>{loginsList}</ul>
      </aside>
    </section>
  );
});
