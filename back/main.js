import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import {History} from './history.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const SAVE_MAX_MESSAGES = 10;

const history = new History(SAVE_MAX_MESSAGES);

app.get('/', (req, res) => {
  res.send('Hello world');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let name = 'Anonymous';

  for (const m of history.get()) {
    socket.emit('chat', m);
  }

  socket.on('message', (event) => {
    name = event.name;

    console.log('>', event.name, event.message);

    const message = {
      time: new Date().toUTCString(),
      message: event.message,
      name: event.name,
    };

    io.emit('chat', message);

    history.add(message);
  });

  socket.on('disconnect', () => {
    console.log(`-- ${name} disconnected.`);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
