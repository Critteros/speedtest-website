import Meter from '../atoms/Meter';

type Props = {
  className?: string;
  downloadSpeed: string;
  uploadSpeed: string;
};

/**
 * Component to show download and upload indicators with custom text value
 * @param className extra classes to style outer div element
 * @param downloadSpeed text to be displayed on download indicator
 * @param uploadSpeed text to be displayed on upload indicator
 * @constructor
 */
const DownloadUploadMeter = ({ className, downloadSpeed, uploadSpeed }: Props) => {
  return (
    <div
      className={`flex flex-col items-center gap-6 overflow-hidden sm:flex-row  ${className ?? ''}`}
    >
      <Meter type={'download'} className="w-60 " text={downloadSpeed} />
      <Meter type={'upload'} className="w-60" text={uploadSpeed} />
    </div>
  );
};

export default DownloadUploadMeter;
