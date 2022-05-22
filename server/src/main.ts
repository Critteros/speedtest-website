import dotenv from 'dotenv';
import { Server } from 'socket.io';
import log4js, { Configuration } from 'log4js';
import * as crypto from 'crypto';
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket';

dotenv.config();

// Logger initialization
const loggerConfiguration: Configuration = {
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%[%p%]]%[ %d{dd/MM/yyy hh:mm:ss} (%f{2})%] %m%n',
      },
    },
  },
  categories: { default: { appenders: ['out'], level: 'warning', enableCallStack: true } },
};
loggerConfiguration.categories.default.level = process.env.NODE_ENV === 'production' ? 'info' : 'trace';
log4js.configure(loggerConfiguration);
const logger = log4js.getLogger();

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  path: '/',
  cors: { origin: process.env['FRONTEND_URL'] },
  maxHttpBufferSize: 1e8,
});

// Client connection
io.on('connection', (socket) => {
  logger.info(`New connection from ${socket.handshake.address}`);

  socket.on('disconnect', (reason) => {
    logger.info(`Disconnected reason: ${reason}`);
  });

  // Upload bytes to client
  socket.on('requestBytes', (count) => {
    logger.trace(`Sending ${count} random bytes`);
    //Precalculating bytes
    const bytes = crypto.randomBytes(count);
    socket.emit('receiveBytes', Date.now(), bytes);
  });

  // Receive bytes from client (discard bytes)
  socket.on('uploadBytes', () => {
    logger.trace('Uploading bytes');
    socket.emit('uploadTime', Date.now());
  });

});


io.listen(parseInt(process.env['PORT'] || '3000'));