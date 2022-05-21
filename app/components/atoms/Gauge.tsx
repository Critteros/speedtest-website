import GaugeChart from 'react-gauge-chart';
import { createLogScale } from '../../lib/scaling';

type Props = {
  className?: string;
  id: string;
  colors?: string[];
  value: number;
  minValue?: number;
  maxValue: number;
};

const Gauge = ({ className, id, colors, value, minValue = 0, maxValue }: Props) => {
  const scalingFunction = createLogScale(minValue, maxValue);
  return (
    <div className={`flex flex-col items-center justify-center gap-2  ${className || ''}`}>
      <GaugeChart
        className=" m-0 w-3/5 max-w-3xl"
        id={id}
        animate={false}
        nrOfLevels={8}
        colors={colors}
        hideText={true}
        percent={scalingFunction(Math.round(value))}
        marginInPercent={0}
        needleColor={'white'}
        needleBaseColor={'rgba(0,0,0,0%)'}
      />
      <span className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">{`${value} Mb/s`}</span>
    </div>
  );
};

export default Gauge;
