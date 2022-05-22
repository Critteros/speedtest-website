import Meter from '../atoms/Meter';

type Props = {
  className?: string;
  downloadSpeed: string;
  uploadSpeed: string;
};

const DownloadUploadMeter = ({ className, downloadSpeed, uploadSpeed }: Props) => {
  return (
    <div
      className={`flex flex-col items-center gap-6 overflow-hidden sm:flex-row  ${className || ''}`}
    >
      <Meter type={'download'} className="w-60 " text={downloadSpeed} />
      <Meter type={'upload'} className="w-60" text={uploadSpeed} />
    </div>
  );
};

export default DownloadUploadMeter;
