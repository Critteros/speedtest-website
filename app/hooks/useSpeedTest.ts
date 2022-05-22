import { useCallback, useEffect, useRef, useState } from 'react';
import { connect, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@backend/types/socket';
import { inCSUnits, throughput } from '../lib/utils';
import { mean, round } from 'lodash';
import { randomBytes } from 'crypto';

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

      /*
        Download Test:
        Client --- RequestBytes(timestamp, dataAmount) --> Server
        Server --- BytesReceived(clientTimeStamp, data) --> Client

        Upload test:
        Client --- RequestUpload(timestamp, data) --> Server
        Server --- UploadComplete(timeDelta) --> Client

        */
      if (!isCancelledRef.current) {
        switch (type) {
          case 'downloading': {
            socketRef.current?.volatile.on('bytesReceived', (clientTimeStamp) => {
              const currentTime = Date.now();
              pastResults.push(throughput(chunkSize, currentTime - clientTimeStamp));
              setBenchmarkingPhase({ action: type, currentValue: round(mean(pastResults)) });
            });

            await new Promise<void>((resolve) => {
              const handle = setInterval(() => {
                if (isCancelledRef.current) {
                  clearInterval(handle);
                  resolve();
                  return;
                }
                socketRef.current?.emit('requestBytes', Date.now(), chunkSize);
              }, 300);

              setTimeout(() => {
                clearInterval(handle);
                resolve();
              }, timeThreshold);
            });

            socketRef.current?.volatile.off('bytesReceived');
            break;
          }

          case 'uploading': {
            socketRef.current?.volatile.on('uploadComplete', (timeDelta) => {
              pastResults.push(throughput(chunkSize, timeDelta));
              setBenchmarkingPhase({ action: type, currentValue: round(mean(pastResults)) });
            });

            const bytes = randomBytes(chunkSize);

            await new Promise<void>((resolve) => {
              const handle = setInterval(() => {
                if (isCancelledRef.current) {
                  clearInterval(handle);
                  resolve();
                  return;
                }
                socketRef.current?.emit('requestUpload', Date.now(), bytes);
              }, 300);

              setTimeout(() => {
                clearInterval(handle);
                resolve();
              }, timeThreshold);
            });

            socketRef.current?.volatile.off('uploadComplete');
            break;
          }
        }
      }

      const finalValue = pastResults.length > 0 ? round(mean(pastResults)) : 0;
      // setBenchmarkingPhase({action: type, currentValue: finalValue});

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
