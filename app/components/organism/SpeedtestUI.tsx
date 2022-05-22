import Gauge from '../atoms/Gauge';
import { useCallback, useEffect } from 'react';
import { useSpeedTest } from '../../hooks/useSpeedTest';
import DownloadUploadMeters from '../molecules/DownloadUploadMeters';
import Button from '../atoms/Button';

type Props = {
  className?: string;
  id: string;
  downloadTestColors?: string[];
  uploadTestColors?: string[];
};

const SpeedtestUI = ({ className, id, downloadTestColors, uploadTestColors }: Props) => {
  const { startSpeedTest, benchmarkingPhase, averageResults, stopSpeedTest } = useSpeedTest(10);

  useEffect(() => {
    (async () => {
      await startSpeedTest();
    })();

    return () => {
      stopSpeedTest();
    };
  }, [startSpeedTest, stopSpeedTest]);

  const onRestart = useCallback(() => {
    stopSpeedTest();
    setTimeout(() => {
      (async () => {
        await startSpeedTest();
      })();
    }, 200);
  }, [stopSpeedTest, startSpeedTest]);

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className ?? ''}`}>
      {benchmarkingPhase !== 'finished' && (
        <>
          <Gauge
            id={id}
            colors={
              benchmarkingPhase.action === 'downloading' ? downloadTestColors : uploadTestColors
            }
            maxValue={1000}
            className="w-full sm:w-11/12"
            value={benchmarkingPhase.currentValue}
          />
          <Button className="mt-3" type="stop" onClick={stopSpeedTest}>
            STOP
          </Button>
        </>
      )}

      <DownloadUploadMeters
        className="mt-7"
        downloadSpeed={`${averageResults.averageDownload ?? '---'} Mb/s`}
        uploadSpeed={`${averageResults.averageUpload ?? '---'} Mb/s`}
      />

      {benchmarkingPhase === 'finished' && (
        <Button onClick={onRestart} className="mt-7" type={'restart'}>
          RESTART
        </Button>
      )}
    </div>
  );
};

export default SpeedtestUI;
