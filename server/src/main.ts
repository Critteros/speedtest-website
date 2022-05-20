import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

dotenv.config();


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { path: '/', cors: { origin: '*' } });

io.on('connection', () => {
  console.log('connection');
});

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});
app.use(cors());
httpServer.listen(process.env['port']);