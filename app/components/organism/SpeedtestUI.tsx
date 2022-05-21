import Gauge from '../atoms/Gauge';
import StopRestartControls from '../molecules/StopRestartControls';
import { useEffect } from 'react';
import { useSpeedTest } from '../../hooks/useSpeedTest';

type Props = {
  className?: string;
  id: string;
  downloadTestColors?: string[];
  uploadTestColors?: string[];
};

const SpeedtestUI = ({ className, id, downloadTestColors, uploadTestColors }: Props) => {
  const { startSpeedTest, benchmarkingPhase } = useSpeedTest(10);

  useEffect(() => {
    (async () => {
      await startSpeedTest();
    })();
  }, [startSpeedTest]);

  if (benchmarkingPhase === 'finished') {
    return <div></div>;
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className || ''}`}>
      <Gauge
        id={id}
        colors={benchmarkingPhase.action === 'downloading' ? downloadTestColors : uploadTestColors}
        maxValue={1000}
        className="w-full sm:w-11/12"
        value={benchmarkingPhase.currentValue}
      />
      <StopRestartControls />
    </div>
  );
};

export default SpeedtestUI;
