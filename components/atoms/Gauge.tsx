import GaugeChart from 'react-gauge-chart';

type Props = {
  className?: string;
  id: string;
  colors?: string[];
  value: number;
};

const Gauge = ({ className, id, colors, value }: Props) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2  ${className ? className : ''}`}
    >
      <GaugeChart
        className=" m-0 w-3/5 max-w-3xl"
        id={id}
        animate={true}
        nrOfLevels={8}
        colors={colors}
        hideText={true}
        percent={value / 100}
        marginInPercent={0}
        needleColor={'white'}
        needleBaseColor={'rgba(0,0,0,0%)'}
      />
      <span className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">{value}</span>
    </div>
  );
};

export default Gauge;
