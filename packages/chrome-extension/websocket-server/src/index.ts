import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();

const parsePortArg = (defaultPort: number): number => {
  const portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    return parseInt(process.argv[portIndex + 1]);
  }
  return defaultPort;
};

const startServer = (port: number) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected');

    socket.on('joinRoom', (room: string) => {
      socket.join(room);
    });

    socket.on('message', (message: string, room: string) => {
      socket.broadcast.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server
    .listen(port, () => {
      console.log(`Server listening on ${port}`);
    })
    .on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} already in use. Using ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error(err);
      }
    });
};

const defaultPort = 9091;
const port = parsePortArg(defaultPort);
startServer(port);
