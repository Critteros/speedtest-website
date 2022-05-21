import Gauge from '../atoms/Gauge';
import StopRestartControls from '../molecules/StopRestartControls';
import * as socketio from 'socket.io-client';
import { useEffect } from 'react';
import { useSpeedTest } from '../../hooks/useSpeedTest';

type Props = {
  className?: string;
  id: string;
  colors?: string[];
};

const SpeedtestUI = ({ className, id, colors }: Props) => {
  const { startSpeedTest, benchmarkingPhase } = useSpeedTest(10);

  useEffect(() => {
    (async () => {
      await startSpeedTest();
    })();
  }, []);

  const gaugeValue = benchmarkingPhase?.currentValue || 0;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className ? className : ''}`}
    >
      <Gauge
        id={id}
        colors={colors}
        maxValue={1000}
        className="w-full sm:w-11/12"
        value={gaugeValue}
      />
      <StopRestartControls />
    </div>
  );
};

export default SpeedtestUI;
