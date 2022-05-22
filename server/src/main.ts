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
  // cors: { origin: '*' },
  maxHttpBufferSize: 1e8,

});

// Client connection
io.on('connection', (socket) => {
  logger.info(`New connection from ${socket.handshake.address}`);


  /*
  Download Test:
  Client --- RequestBytes(timestamp, dataAmount) --> Server
  Server --- BytesReceived(clientTimeStamp, data) --> Client

  Upload test:
  Client --- RequestUpload(timestamp, data) --> Server
  Server --- UploadComplete(timeDelta) --> Client

   */

  socket.volatile.on('requestUpload', (timestamp) => {
    const currentTime = Date.now();
    logger.trace('Uploading bytes');
    socket.emit('uploadComplete', currentTime - timestamp);
  });

  socket.volatile.on('requestBytes', (timestamp, dataAmount) => {
    const data = crypto.randomBytes(dataAmount);
    logger.trace(`Sending ${dataAmount} random bytes`);
    socket.emit('bytesReceived', timestamp, data);
  });

  socket.on('disconnect', (reason) => {
    logger.info(`Disconnected reason: ${reason}`);
  });

});


io.listen(parseInt(process.env['PORT'] || '3000'));