import { FC, memo } from 'react';

const timeDigitFormat = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 2,
  minimumFractionDigits: 0
});

export interface MessageProps {
  id: string;
  time: number;
  message: string;
  login: string;
}

export const Message: FC<MessageProps> = memo(function Message(message: MessageProps) {
  const datetime = new Date(message.time);
  const time = `${timeDigitFormat.format(datetime.getHours())}:${timeDigitFormat.format(datetime.getMinutes())}`;
  return <pre
    key={message.id}
  >{time} [{message.login}]: {message.message}</pre>;
});
