"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const parsePortArg = (defaultPort) => {
    const portIndex = process.argv.indexOf('--port');
    if (portIndex !== -1 && process.argv[portIndex + 1]) {
        return parseInt(process.argv[portIndex + 1]);
    }
    return defaultPort;
};
const startServer = (port) => {
    const server = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('joinRoom', (room) => {
            socket.join(room);
        });
        socket.on('message', (message, room) => {
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
        .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} already in use. Using ${port + 1}...`);
            startServer(port + 1);
        }
        else {
            console.error(err);
        }
    });
};
const defaultPort = 9091;
const port = parsePortArg(defaultPort);
startServer(port);
