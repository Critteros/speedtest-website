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
  const { startDownloadTest } = useSpeedTest();

  useEffect(() => {
    (async () => {
      await startDownloadTest();
    })();
  }, []);
  return (
    <div className={`flex flex-col items-center justify-center ${className ? className : ''}`}>
      <Gauge id={id} colors={colors} className="w-full sm:w-11/12" value={10} />
      <StopRestartControls />
    </div>
  );
};

export default SpeedtestUI;
