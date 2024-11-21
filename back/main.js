import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);


app.get('/', (req, res) => {
  res.send('Hello world');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (event) => {
    // event.name
    console.log('message', event.message);

    io.emit('chat', {
      time: new Date().toUTCString(),
      message: event.message,
      name: event.name,
    });
  });

  socket.on('disconnect', () => {
    console.log(' -- a user dosconnected.');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});