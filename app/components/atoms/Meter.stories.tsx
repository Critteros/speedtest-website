import Meter from './Meter';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/atoms/Meter',
  component: Meter,
  argTypes: {
    className: {
      table: { disable: true },
    },
    type: { description: 'Style of indicator' },
    text: { description: 'Text to display on the indicator' },
  },
};

const Template: ComponentStory<typeof Meter> = (args) => <Meter {...args} />;

export const Download = Template.bind({});
Download.args = {
  type: 'download',
  text: 'Download',
  className: 'w-52',
};

export const Upload = Template.bind({});
Upload.args = {
  type: 'upload',
  text: 'Upload',
  className: 'w-52',
};
