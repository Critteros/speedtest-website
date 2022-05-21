import dotenv from 'dotenv';
import { Server } from 'socket.io';
import log4js, { Configuration } from 'log4js';
import * as crypto from 'crypto';
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket';

dotenv.config();

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
loggerConfiguration.categories.default.level = 'trace';
log4js.configure(loggerConfiguration);
const logger = log4js.getLogger();

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  path: '/',
  cors: { origin: process.env['FRONTEND_URL'] },
});

io.on('connection', (socket) => {
  logger.info(`New connection from ${socket.handshake.address}`);

  socket.on('disconnect', (reason) => {
    logger.info(`Disconnected reason: ${reason}`);
  });

  socket.on('requestBytes', (count) => {
    console.log(`Sending ${count} random bytes`);
    socket.emit('receiveBytes', crypto.randomBytes(count));
  });

});


io.listen(parseInt(process.env['PORT'] || '3000'));