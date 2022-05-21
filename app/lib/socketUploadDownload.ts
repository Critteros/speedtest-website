import type { ServerToClientEvents, ClientToServerEvents } from '@backend/types/socket';
import { Socket } from 'socket.io-client';
import { number } from 'prop-types';

type UnitsType = 'B' | 'KB' | 'MB' | 'GB';

export const timeDownloadChunk = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  chunkSize: number,
) => {
  const downloadStart = Date.now();
  socket.emit('requestBytes', chunkSize);

  return new Promise<number>((resolve) => {
    socket.once('receiveBytes', () => {
      const afterDownload = Date.now();
      resolve(afterDownload - downloadStart);
    });
  });
};

export const inCSUnits = (count: number, unit: UnitsType) => {
  switch (unit) {
    case 'B':
      return count;
    case 'KB':
      return count * 1024;
    case 'MB':
      return count * 1024 * 1024;
    case 'GB':
      return count * 1024 * 1024 * 1024;
  }
};

export const throughput = (count: number, timeDelta: number) => {
  const perSecond = 1000 / timeDelta;
  const bytesPerSecond = count * perSecond;

  return (bytesPerSecond * 8) / (1024 * 1024);
};
