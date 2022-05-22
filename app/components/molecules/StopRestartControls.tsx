import Button from '../atoms/Button';

type Props = {
  className?: string;
  onStop: () => void;
  onRestart: () => void;
};

const StopRestartControls = ({ className, onStop, onRestart }: Props) => {
  return (
    <div className={`m-3 flex items-center justify-center gap-6 ${className || ''}`}>
      <Button type="stop" onClick={onStop}>
        Stop
      </Button>
      <Button type="restart" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
};

export default StopRestartControls;
