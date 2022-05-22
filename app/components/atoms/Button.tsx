import React from 'react';
import { RefreshIcon, StopIcon } from '@heroicons/react/solid';

type ButtonType = 'stop' | 'restart';

type ButtonProps = {
  children?: React.ReactNode;
  type: ButtonType;
  className?: string;
};

const Button = ({ children, type, className }: ButtonProps) => {
  switch (type) {
    case 'restart':
      return (
        <button
          className={`flex items-center justify-between gap-2 rounded-md bg-blue-700 p-2 font-bold uppercase text-white ${
            className || ''
          }`}
        >
          <RefreshIcon className="w-6" />
          {children}
        </button>
      );

    case 'stop':
      return (
        <button
          className={`flex items-center justify-between gap-2 rounded-md bg-red-700 p-2 font-bold uppercase text-white ${
            className || ''
          }`}
        >
          <StopIcon className="w-6" />
          {children}
        </button>
      );
  }
};

export default Button;
