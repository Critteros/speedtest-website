import React from 'react';
import { RefreshIcon, StopIcon } from '@heroicons/react/solid';

type ButtonType = 'stop' | 'restart';

type ButtonProps = {
  type: ButtonType;
  className?: string;
  onClick?: () => void;
  label?: string;
};

/**
 * Custom button component
 * @param children button children elements
 * @param type either stop button or restart button
 * @param className extra classes given to button element
 * @param onClick on click callback
 * @constructor
 */
const Button = ({ type, className, onClick, label }: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-between gap-2 rounded-md p-2 transition duration-150 ease-in-out hover:translate-y-0.5 active:translate-y-1  ${
        className ?? ''
      } ${type === 'restart' ? 'bg-blue-700 active:bg-blue-800' : ''} ${
        type === 'stop' ? 'bg-red-700 active:bg-red-800' : ''
      }`}
      onClick={onClick}
    >
      {type === 'stop' && <StopIcon className="w-6 text-white" />}
      {type === 'restart' && <RefreshIcon className="w-6 text-white" />}

      <span className="font-bold uppercase text-white">{label}</span>
    </button>
  );
};

export default Button;
