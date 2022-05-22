import GaugeChart from 'react-gauge-chart';
import { useMemo } from 'react';
import { createLogScale } from '../../lib/utils';

type Props = {
  className?: string;
  id: string;
  colors?: string[];
  value: number;
  minValue?: number;
  maxValue: number;
  postfix?: string;
  needleColor?: string;
  textStyles?: string;
};

/**
 * Gauge component that display given value on circular gauge with logarithmic scale
 * @param className extra classnames to be given to outer div element
 * @param id unique id
 * @param colors pair of colors used to interpolate colors on gauge
 * @param value current gauge value to be displayed
 * @param minValue
 * @param maxValue
 * @param postfix string added to the end of value under gauge
 * @param needleColor color of the needle
 * @param textStyles extra classes to style text
 * @constructor
 */
const Gauge = ({
  className,
  id,
  colors,
  value,
  minValue = 0,
  maxValue,
  postfix,
  needleColor = 'white',
  textStyles,
}: Props) => {
  const scalingFunction = useMemo(() => createLogScale(minValue, maxValue), [minValue, maxValue]);
  return (
    <div className={`flex flex-col items-center justify-center gap-2  ${className ?? ''}`}>
      <GaugeChart
        className=" m-0 w-3/5 max-w-3xl"
        id={id}
        animate={false}
        nrOfLevels={8}
        colors={colors}
        hideText={true}
        percent={scalingFunction(Math.round(value))}
        marginInPercent={0}
        needleColor={needleColor}
        needleBaseColor={'rgba(0,0,0,0%)'}
      />
      <span
        className={`text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl ${textStyles ?? ''}`}
      >{`${value} ${postfix ?? ''}`}</span>
    </div>
  );
};

export default Gauge;
