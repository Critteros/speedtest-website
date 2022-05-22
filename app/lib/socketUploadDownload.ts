import type { ClientToServerEvents, ServerToClientEvents } from '@backend/types/socket';
import { Socket } from 'socket.io-client';
import { randomBytes } from 'crypto';

type UnitsType = 'B' | 'KB' | 'MB' | 'GB';

/**
 * Download single block of given chunkSize
 * @param socket socket to use
 * @param chunkSize how many bytes to download
 */
export const timeDownloadChunk = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  chunkSize: number,
) => {
  socket.emit('requestBytes', chunkSize);

  return new Promise<number>((resolve) => {
    socket.once('receiveBytes', (timestamp) => {
      const afterDownload = Date.now();
      resolve(afterDownload - timestamp);
    });
  });
};

/**
 * Uploads single block of random data of given size
 * @param socket socket to use
 * @param chunkSize how many bytes to upload
 */
export const timeUploadChunk = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  chunkSize: number,
) => {
  const bytes = randomBytes(chunkSize);

  const uploadStart = Date.now();
  socket.emit('uploadBytes', bytes);

  return new Promise<number>((resolve) => {
    socket.once('uploadTime', (timestamp) => {
      resolve(timestamp - uploadStart);
    });
  });
};

/**
 * Helper function to return number of bytes from CS unit like 1MB
 * @param count
 * @param unit
 */
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

/**
 * Calculates throughput from time that took count bytes to transfer
 * @param count number ob bytes transferred
 * @param timeDelta time that these bytes took to transfer
 */
export const throughput = (count: number, timeDelta: number) => {
  const perSecond = 1000 / timeDelta;
  const bytesPerSecond = count * perSecond;

  return (bytesPerSecond * 8) / (1024 * 1024);
};
