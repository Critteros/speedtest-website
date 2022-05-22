import { DownloadIcon, UploadIcon } from '@heroicons/react/outline';

type Props = {
  className?: string;
  text?: string;
  type: 'download' | 'upload';
};

const Meter = ({ className, text, type }: Props) => {
  return (
    <div
      className={`flex items-center justify-between overflow-hidden rounded-md ${
        type === 'download'
          ? 'bg-gradient-to-tr from-green-600 to-green-300'
          : 'bg-gradient-to-tr from-violet-500 to-pink-500'
      }  p-2 ${className || ''}`}
    >
      {type === 'download' ? (
        <DownloadIcon className="h-8 w-8" color="#fff" />
      ) : (
        <UploadIcon className="h-8" color="#fff" />
      )}

      <span className="flex self-end whitespace-nowrap text-3xl text-white">
        {text ?? '--- Mb/s'}
      </span>
    </div>
  );
};

export default Meter;
