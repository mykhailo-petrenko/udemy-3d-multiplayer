import { ChangeEvent, FC, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { JSX } from 'react/jsx-runtime';

const socket = io({autoConnect: false});

export interface ChatProps {
  name: string;
  socket: Socket;
}

let history: JSX.Element[] = [];

const timeDigitFormat = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 2,
  minimumFractionDigits: 0
});


export const Chat: FC<ChatProps> = function Chat({name, socket}) {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const listener = ({time, name, message}) => {
      const date = new Date(time);


      const row = <pre
        key={history.length.toString(10)}
      >{timeDigitFormat.format(date.getHours())}:{timeDigitFormat.format(date.getMinutes())} [{name}]: {message}</pre>;

      history = [
        ...history,
        row,
      ];

      setMessages(history);
    };

    socket.on('chat', listener);

    return () => {
      socket.off('chat', listener);
    };
  }, [setMessages]);

  const sendMessage = useCallback((message) => {
    socket.emit('message', {
      message: message,
      name: name,
    });
    setMessage('');
  }, [name, setMessage]);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, [setMessage]);

  const keyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && message.length > 0) {
      sendMessage(message);
    }
  }, [message, sendMessage]);

  return (
    <section className="app-chat">
      <section>
        {messages}
      </section>
      <footer>
        <input
          type="text"
          value={message}
          onChange={onChange}
          onKeyDown={keyDown}
        />
      </footer>
    </section>
  );
}


export const ChartWrapper: FC<{name: string}> = function ChatWrapper({name}) {
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.io.on("reconnect", () => {
      setConnected(socket.connected);
    });

    return () => {
      socket.disconnect();
    };
  }, [setConnected])

  if (isConnected) {
    return <section className="app-chat">
      Connecting...
    </section>
  }

  return <Chat name={name} socket={socket} />
};
