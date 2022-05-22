import Gauge from './Gauge';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/atoms/Gauge',
  comment: Gauge,
  argTypes: {
    id: { description: 'Unique id' },
    maxValue: { description: 'Maximum value that gauge should display' },
    value: { description: 'Current value to display in logarithmic scale' },
    needleColor: { description: 'Needle color' },
    textStyles: { description: 'Extra style classes for text', table: { control: false } },
    postfix: { description: 'Postfix added to text below gauge', control: 'text' },
    className: { table: { disable: true } },
  },
};

const Template: ComponentStory<typeof Gauge> = (args) => <Gauge {...args} />;

export const LogarithmicScale = Template.bind({});
LogarithmicScale.args = {
  id: 'DefaultColors',
  maxValue: 100,
  value: 30,
  needleColor: 'black',
  textStyles: 'text-black',
};
