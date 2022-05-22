import Gauge from '../atoms/Gauge';
import StopRestartControls from '../molecules/StopRestartControls';
import { useEffect } from 'react';
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
  const { startSpeedTest, benchmarkingPhase, averageResults } = useSpeedTest(10);

  useEffect(() => {
    (async () => {
      await startSpeedTest();
    })();
  }, [startSpeedTest]);

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
          <StopRestartControls
            onRestart={() => {
              console.log('Restart Clicked');
            }}
            onStop={() => {
              console.log('Stop Clicked');
            }}
          />
        </>
      )}

      <DownloadUploadMeters
        className="mt-7"
        downloadSpeed={`${averageResults.averageDownload ?? '---'} Mb/s`}
        uploadSpeed={`${averageResults.averageUpload ?? '---'} Mb/s`}
      />

      {benchmarkingPhase === 'finished' && (
        <Button
          onClick={() => {
            console.log('Restart Clicked');
          }}
          className="mt-7"
          type={'restart'}
        >
          RESTART
        </Button>
      )}
    </div>
  );
};

export default SpeedtestUI;
