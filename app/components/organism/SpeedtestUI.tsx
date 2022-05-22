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

/**
 * Main Speedtest UI component it includes gauge, buttons and indicators about current speedtest
 * @param className extra classes to style containing div element
 * @param id unique id
 * @param downloadTestColors pair of colors that will be used to interpolate colors on gauge
 * @param uploadTestColors pair of colors that will be used to interpolate colors on gauge
 * @constructor
 */
const SpeedtestUI = ({ className, id, downloadTestColors, uploadTestColors }: Props) => {
  const { startSpeedTest, benchmarkingPhase, averageResults, stopSpeedTest } = useSpeedTest(10);

  useEffect(() => {
    setTimeout(async () => {
      await startSpeedTest();
    }, 1000);

    return () => {
      stopSpeedTest();
    };
  }, [startSpeedTest, stopSpeedTest]);

  const onRestart = useCallback(() => {
    stopSpeedTest();

    // This should be fine because we are in useCallback with well-defined dependency array
    // I would advise not to remove this for UX and also possible race condition when cancelling previous speedtest
    // stopSpeedTest() must have some time to properly stop speedtest
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
            postfix="Mb/s"
          />
          <Button className="mt-3" type="stop" onClick={stopSpeedTest} label="STOP" />
        </>
      )}

      <DownloadUploadMeters
        className="mt-7"
        downloadSpeed={`${averageResults.averageDownload ?? '---'} Mb/s`}
        uploadSpeed={`${averageResults.averageUpload ?? '---'} Mb/s`}
      />

      {benchmarkingPhase === 'finished' && (
        <Button onClick={onRestart} className="mt-7" type={'restart'} label="RESTART" />
      )}
    </div>
  );
};

export default SpeedtestUI;
