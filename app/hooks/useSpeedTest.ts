import { useEffect, useRef, useState } from 'react';
import * as socketio from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@backend/types/socket';
import {timeDownloadChunk, inCSUnits, throughput, timeUploadChunk} from '../lib/socketUploadDownload';
import { throttle, mean, round } from 'lodash';

type BenchmarkingPhase = {
  action: 'uploading' | 'downloading';
  currentValue: number;
};

type AverageResults = {
  averageDownload: null | number;
  averageUpload: null | number;
};

// io do not accept for some reason type string|undefined
const backendURL = process.env['NEXT_PUBLIC_BACKEND_URL'] ?? '';

export const useSpeedTest = (timePerTest: number) => {
  const [benchmarkingPhase, setBenchmarkingPhase] = useState<BenchmarkingPhase>();
  const [averageResults, setAverageResults] = useState<AverageResults>({
    averageUpload: null,
    averageDownload: null,
  });
  const socketRef = useRef<socketio.Socket<ServerToClientEvents, ClientToServerEvents> | null>(
    null,
  );

  useEffect(() => {
    console.log('Initializing new socket');
    socketRef.current = socketio.connect(backendURL, { forceNew: true });

    return () => {
      console.log('Disconnecting socket');
      socketRef.current?.disconnect();
    };
  }, []);

  const downloadSpeed = async () => {
    console.log('Download speed test');
    if (socketRef.current === null) {
      console.error('Socket is null!');
      return;
    }

    const chunkSize = inCSUnits(20, 'MB');
    const timeThreshold = timePerTest * 1000;
    const pastResults: Array<number> = [];

    const throttledUpdate = throttle(() => {
      setBenchmarkingPhase({ action: 'downloading', currentValue: round(mean(pastResults)) });
    }, 1000);

    let cumulativeTime = 0;
    while (cumulativeTime < timeThreshold) {
      const timeDelta = await timeDownloadChunk(socketRef.current, chunkSize);
      //TODO: Adaptative chunk size
      pastResults.push(throughput(chunkSize, timeDelta));
      throttledUpdate();

      cumulativeTime += timeDelta;
    }
    setBenchmarkingPhase({ action: 'downloading', currentValue: round(mean(pastResults)) });
    setAverageResults((prevState) => ({ ...prevState, averageDownload: round(mean(pastResults)) }));
  };

  const uploadSpeed = async () => {
    if (socketRef.current === null) {
      console.error('Socket is null!');
      return;
    }
    const chunkSize = inCSUnits(20, 'MB');
    const timeThreshold = timePerTest * 1000;
    const pastResults: Array<number> = [];

    const throttledUpdate = throttle(() => {
      setBenchmarkingPhase({ action: 'uploading', currentValue: round(mean(pastResults)) });
    }, 1000);

    let cumulativeTime = 0;
    while (cumulativeTime < timeThreshold) {
      const timeDelta = await timeUploadChunk(socketRef.current, chunkSize);
      //TODO: Adaptative chunk size
      pastResults.push(throughput(chunkSize, timeDelta));
      throttledUpdate();

      cumulativeTime += timeDelta;
    }
    setBenchmarkingPhase({ action: 'uploading', currentValue: round(mean(pastResults)) });
    setAverageResults((prevState) => ({ ...prevState, averageUpload: round(mean(pastResults)) }));
  }

  const startSpeedTest = async () => {
    if (socketRef.current === null) {
      console.error('Socket is null!');
      return;
    }

    await uploadSpeed();
  };

  return { benchmarkingPhase, averageResults, startSpeedTest };
};
