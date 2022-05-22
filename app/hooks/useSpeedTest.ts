import { useCallback, useEffect, useRef, useState } from 'react';
import { connect, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@backend/types/socket';
import {
  inCSUnits,
  throughput,
  timeDownloadChunk,
  timeUploadChunk,
} from '../lib/socketUploadDownload';
import { mean, round } from 'lodash';

type BenchmarkingPhase = {
  action: 'uploading' | 'downloading';
  currentValue: number;
};

type AverageResults = {
  averageDownload: null | number;
  averageUpload: null | number;
};

// For some reason socket.io doesn't accept type string | undefined in its constructor
const backendURL = process.env['NEXT_PUBLIC_BACKEND_URL'] ?? '';

/**
 * This hook implement speed-testing logic
 * @param timePerTest time in second that upload and upload test will take separate, WARNING this value should be constant to avoid rerenders
 */
export const useSpeedTest = (timePerTest: number) => {
  const [benchmarkingPhase, setBenchmarkingPhase] = useState<BenchmarkingPhase | 'finished'>({
    action: 'downloading',
    currentValue: 0,
  });
  const [averageResults, setAverageResults] = useState<AverageResults>({
    averageUpload: null,
    averageDownload: null,
  });
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  // Used to cancel speedtest, we don't want rerender when changing this value
  const isCancelledRef = useRef<boolean>(false);

  // Used to initialize and deinitialize socket
  // each speedtest should have its own instance of socket
  useEffect(() => {
    console.log('Initializing new socket');
    socketRef.current = connect(backendURL);

    return () => {
      console.log('Disconnecting socket');
      socketRef.current?.disconnect();
    };
  }, []);

  // Function that will perform upload or download speed test
  const performTest = useCallback(
    async (type: 'uploading' | 'downloading') => {
      if (socketRef.current === null) {
        console.error('Socket is null!');
        return;
      }

      const chunkSize = inCSUnits(20, 'MB');
      const timeThreshold = timePerTest * 1000;
      const pastResults: Array<number> = [];

      let cumulativeTime = 0;
      while (!isCancelledRef.current && cumulativeTime < timeThreshold) {
        const timeDelta =
          type === 'uploading'
            ? await timeUploadChunk(socketRef.current, chunkSize)
            : await timeDownloadChunk(socketRef.current, chunkSize);
        pastResults.push(throughput(chunkSize, timeDelta));
        setBenchmarkingPhase({ action: type, currentValue: round(mean(pastResults)) });

        cumulativeTime += timeDelta;
      }

      const finalValue = pastResults.length > 0 ? round(mean(pastResults)) : 0;
      setBenchmarkingPhase({ action: type, currentValue: finalValue });

      switch (type) {
        case 'uploading':
          setAverageResults((prevState) => ({
            ...prevState,
            averageUpload: finalValue,
          }));
          break;
        case 'downloading':
          setAverageResults((prevState) => ({
            ...prevState,
            averageDownload: finalValue,
          }));
          break;
      }
      if (isCancelledRef.current) setBenchmarkingPhase('finished');
    },
    [timePerTest],
  );

  // handle with care, I have encountered many bugs using this function that end up in massive memory leaks leading to 100% ram usage on host
  // I cannot explain cause of these bugs, just be aware of them
  const startSpeedTest = useCallback(async () => {
    if (socketRef.current === null) {
      console.error('Socket is null!');
      return;
    }

    isCancelledRef.current = false;
    setBenchmarkingPhase({ action: 'downloading', currentValue: 0 });
    await performTest('downloading');
    setBenchmarkingPhase({ action: 'uploading', currentValue: 0 });
    await performTest('uploading');
    setBenchmarkingPhase('finished');
  }, [performTest]);

  // used to stop speedtest
  const stopSpeedTest = useCallback(() => {
    isCancelledRef.current = true;
  }, []);

  return { benchmarkingPhase, averageResults, startSpeedTest, stopSpeedTest };
};
