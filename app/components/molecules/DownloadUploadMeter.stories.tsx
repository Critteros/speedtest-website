import DownloadUploadMeters from './DownloadUploadMeters';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/molecules/DownloadUploadMeters',
  component: DownloadUploadMeters,
  argTypes: {
    className: {
      table: { disable: true },
    },
    downloadSpeed: { description: 'Text to be displayed on download indicator' },
    uploadSpeed: { description: 'Text to be displayed on upload indicator' },
  },
};

const Template: ComponentStory<typeof DownloadUploadMeters> = (args) => (
  <DownloadUploadMeters {...args} />
);

export const Default = Template.bind({});
Default.args = {
  downloadSpeed: '1000 Mb/s',
  uploadSpeed: '2000 Mb/s',
};
