import Button from '../atoms/Button';

type Props = {
  className?: string;
};

const StopRestartControls = ({ className }: Props) => {
  return (
    <div className={`m-3 flex items-center justify-center gap-6 ${className || ''}`}>
      <Button type="stop">Stop</Button>
      <Button type="restart">Restart</Button>
    </div>
  );
};

export default StopRestartControls;
