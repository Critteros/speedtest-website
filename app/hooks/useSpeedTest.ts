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
  // State to track if we are currently performing upload or download test, if both test were finished or cancelled then it is set to 'finished'
  const [benchmarkingPhase, setBenchmarkingPhase] = useState<BenchmarkingPhase | 'finished'>({
    action: 'downloading',
    currentValue: 0,
  });

  // State to track average values to display to the user
  const [averageResults, setAverageResults] = useState<AverageResults>({
    averageUpload: null,
    averageDownload: null,
  });

  // Reference to socket instance, each speedtest should have its own instance
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  // Used to cancel any ongoing test will eventually result in setting benchmarkingPhase to 'finished'
  // to avoid unnecessary rerenders we track this value in reference and not in a state
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
  // this is very heavy function and can cause problems if invoked many times without cancelling previous call
  const performTest = useCallback(
    async (type: 'uploading' | 'downloading') => {
      // Make sure that the socket instance is in defined state
      if (socketRef.current === null) {
        console.error('Socket is null!');
        return;
      }

      // that much data in bytes will be sent Client->Server and vice versa
      const chunkSize = inCSUnits(20, 'MB');

      // timeout time for each test
      const timeThreshold = timePerTest * 1000;

      // place to store timing information
      const pastResults: Array<number> = [];

      /*
        Download Test:
        Client --- RequestBytes(timestamp, dataAmount) --> Server
        Server --- BytesReceived(clientTimeStamp, data) --> Client

        Upload test:
        Client --- RequestUpload(timestamp, data) --> Server
        Server --- UploadComplete(timeDelta) --> Client

        */
      // this if statement guarantees that no action will be taken if operation have been already cancelled
      if (!isCancelledRef.current) {
        // Used to combine upload and download logic into single function
        switch (type) {
          case 'downloading': {
            // volatile behaves like UDP packets, we really don't want to queue these blocks of data
            socketRef.current?.volatile.on('bytesReceived', (clientTimeStamp) => {
              const currentTime = Date.now();
              pastResults.push(throughput(chunkSize, currentTime - clientTimeStamp));
              setBenchmarkingPhase({ action: type, currentValue: round(mean(pastResults)) });
            });

            // Downloading packets every 300ms for up to max of timePerTest seconds
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

            // Removing event listener
            socketRef.current?.volatile.off('bytesReceived');
            break;
          }

          // Almost the same as above
          case 'uploading': {
            socketRef.current?.volatile.on('uploadComplete', (timeDelta) => {
              pastResults.push(throughput(chunkSize, timeDelta));
              setBenchmarkingPhase({ action: type, currentValue: round(mean(pastResults)) });
            });

            //could be moved to useMemo
            //to reduce bundle size crypto.randomBytes should be replaced crypto bundle weights (100KB)
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

      // Setting average values
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

  // handle with care, never call more than once at a given time or your memory will disappear
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
