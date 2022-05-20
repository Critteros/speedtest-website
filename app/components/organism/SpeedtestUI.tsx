import Gauge from '../atoms/Gauge';
import StopRestartControls from '../molecules/StopRestartControls';
import * as socketio from 'socket.io-client';
import { useEffect } from 'react';

type Props = {
  className?: string;
  id: string;
  colors?: string[];
};

// io do not accept for some reason type string|undefined
const backendURL = process.env['NEXT_PUBLIC_BACKEND_URL'] ?? '';
const socket = socketio.connect(backendURL);

const SpeedtestUI = ({ className, id, colors }: Props) => {
  useEffect(() => {
    const backendUrl = process.env['NEXT_PUBLIC_BACKEND_URL'];
    socket.emit('TEST', 'data');
    console.log(socket.active);
    console.log(backendUrl);
  }, []);
  return (
    <div className={`flex flex-col items-center justify-center ${className ? className : ''}`}>
      <Gauge id={id} colors={colors} className="w-full sm:w-11/12" value={10} />
      <StopRestartControls />
    </div>
  );
};

export default SpeedtestUI;
