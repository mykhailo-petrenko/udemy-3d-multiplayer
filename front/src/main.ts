import './style.css'

import { io } from 'socket.io-client';

import { setupChat } from './chat';

const socket = io();

console.log(socket);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    Hello Dolly.

    <section id="chat">
    </section>
  </div>
`

setupChat(socket, document.querySelector<HTMLElement>('#chat'));

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
