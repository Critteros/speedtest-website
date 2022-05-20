import Gauge from '../atoms/Gauge';
import StopRestartControls from '../molecules/StopRestartControls';

type Props = {
  className?: string;
  id: string;
  colors?: string[];
};
const SpeedtestUI = ({ className, id, colors }: Props) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className ? className : ''}`}>
      <Gauge id={id} colors={colors} className="w-full sm:w-11/12" value={10} />
      <StopRestartControls />
    </div>
  );
};

export default SpeedtestUI;
