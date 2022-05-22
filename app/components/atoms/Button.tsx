import React from 'react';
import { RefreshIcon, StopIcon } from '@heroicons/react/solid';

type ButtonType = 'stop' | 'restart';

type ButtonProps = {
  children?: React.ReactNode;
  type: ButtonType;
  className?: string;
  onClick: () => void;
};

/**
 * Custom button component
 * @param children button children elements
 * @param type either stop button or restart button
 * @param className extra classes given to button element
 * @param onClick on click callback
 * @constructor
 */
const Button = ({ children, type, className, onClick }: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-between gap-2 rounded-md p-2 font-bold uppercase text-white transition duration-150 ease-in-out hover:translate-y-0.5 active:translate-y-1  ${
        className ?? ''
      } ${type === 'restart' ? 'bg-blue-700 active:bg-blue-800' : ''} ${
        type === 'stop' ? 'bg-red-700 active:bg-red-800' : ''
      }`}
      onClick={onClick}
    >
      {type === 'stop' && <StopIcon className="w-6" />}
      {type === 'restart' && <RefreshIcon className="w-6" />}

      {children}
    </button>
  );
};

export default Button;
