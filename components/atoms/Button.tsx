import React from 'react';
import { RefreshIcon, StopIcon } from '@heroicons/react/solid';

type ButtonType = 'stop' | 'restart';

type ButtonProps = {
  children?: React.ReactNode;
  type: ButtonType;
  className?: string;
};

const Button = ({ children, type }: ButtonProps) => {
  if (type === 'stop') {
    return (
      <button className="flex items-center justify-between gap-2 rounded-md bg-red-700 p-2 font-bold uppercase text-white">
        <StopIcon className="w-6" />
        {children}
      </button>
    );
  }

  if (type === 'restart') {
    return (
      <button className="flex items-center justify-between gap-2 rounded-md bg-blue-700 p-2 font-bold uppercase text-white">
        <RefreshIcon className="w-6" />
        {children}
      </button>
    );
  }

  return <button>{children}</button>;
};

export default Button;
