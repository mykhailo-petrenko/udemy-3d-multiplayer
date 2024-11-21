import { Socket } from 'socket.io-client';

export function setupChat(socket: Socket, element: HTMLElement) {
  if (!element) {
    return;
  }

  element.innerHTML = `
    <div id="messages">
    ...
    </div>
    <input type="text" name="myMessage" id="myMessage" placeholder="your message.." />
  `;
  
  const send = (message) => {
    socket.emit('message', {
      message: message,
      name: 'I name',
    });
  };

  const messages = document.querySelector<HTMLInputElement>('#messages');
  const input = document.querySelector<HTMLInputElement>('#myMessage');

  socket.on('chat', ({time, name, message}) => {
    const row = document.createElement('div');
    row.innerText = `${time} [${name}]: ${message}`;

    messages.appendChild(row);
  });

  input.addEventListener('keydown', (event: KeyboardEvent) => {
    let message = '';

    if (event.code === 'Enter') {
      message = input.value;

      input.value = '';

      send(message);
    }
  });

}
