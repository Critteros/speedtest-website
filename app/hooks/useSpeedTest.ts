import { useEffect, useRef, useState } from 'react';
import * as socketio from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@backend/types/socket';
import { timeDownloadChunk, inCSUnits, throughput } from '../lib/socketUploadDownload';

type DownloadSpeedStats = {
  currentDownloadSpeed: number;
  averageDownloadSpeed: number | undefined;
};

type UploadSpeedStats = {
  currentUploadSpeed: number;
  averageUploadSpeed: number | undefined;
};

// io do not accept for some reason type string|undefined
const backendURL = process.env['NEXT_PUBLIC_BACKEND_URL'] ?? '';

export const useSpeedTest = () => {
  const [downloadStats, setDownloadStats] = useState<DownloadSpeedStats | undefined>();
  const [uploadStats, setUploadStats] = useState<UploadSpeedStats | undefined>();
  const socket = useRef<socketio.Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    console.log('Initializing new socket');
    socket.current = socketio.connect(backendURL, { forceNew: true });

    return () => {
      console.log('Disconnecting socket');
      socket.current?.disconnect();
    };
  }, []);

  const startDownloadTest = async () => {
    console.log('Download speed test');
    if (socket.current === null) {
      console.error('Socket is null!');
      return;
    }

    const chunkSize = inCSUnits(50, 'MB');
    const result = await timeDownloadChunk(socket.current, chunkSize);
    console.log(throughput(chunkSize, result));
  };

  const startUploadTest = () => {
    console.log('Upload speed test');
  };

  return { downloadStats, uploadStats, startDownloadTest, startUploadTest };
};
