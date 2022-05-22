import DownloadUploadMeters from './DownloadUploadMeters';
import { render, screen } from '@testing-library/react';

describe('DownloadUploadMeters', () => {
  it('displays download and upload text', () => {
    render(<DownloadUploadMeters downloadSpeed={'downloadText'} uploadSpeed={'uploadText'} />);

    const downloadText = screen.getByText('downloadText');
    const uploadText = screen.getByText('uploadText');

    expect(downloadText).toBeInTheDocument();
    expect(uploadText).toBeInTheDocument();
  });
});
