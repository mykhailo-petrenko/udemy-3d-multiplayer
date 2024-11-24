import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

import express from 'express';
import { Server } from 'socket.io';

import { History } from './history.js';
import { WhoOnline } from './whoOnline.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const SAVE_MAX_MESSAGES = 10;

const history = new History(SAVE_MAX_MESSAGES);
const whoOnline = new WhoOnline();

app.get('/', (req, res) => {
  res.send('Hello world');
});

whoOnline.onChange(() => {
  io.emit('online', {
    logins: whoOnline.logins()
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let login = null;

  socket.on('login', (event) => {
    login = event.login;
    console.log(`${login} logged IN!`);

    whoOnline.update(socket.id, login);

    socket.emit('online', {
      logins: whoOnline.logins()
    });
    socket.emit('history', {
      messages: history.get()
    });
  });

  socket.on('message', (event) => {
    login = event.login;

    whoOnline.update(socket.id, login);

    console.log('>', event.login, event.message);

    const message = {
      id: randomUUID(),
      time: (new Date()).getTime(),
      message: event.message,
      login: login
    };

    io.emit('chat', message);

    history.add(message);
  });

  socket.on('logout', (event) => {
    console.log(`-- ${login} log out.`);
    login = null;
    whoOnline.offline(socket.id);
  });

  socket.on('disconnect', () => {
    console.log(`-- ${login} disconnected.`);
    whoOnline.offline(socket.id);
  });

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
