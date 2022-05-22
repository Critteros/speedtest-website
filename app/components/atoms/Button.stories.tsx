import Button from './Button';
import '../../styles/globals.css';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/atoms/Button',
  component: Button,
  argTypes: {
    className: {
      table: { control: false },
      description: 'Extra classes to style component',
    },
    label: { control: 'text', description: 'Text to be displayed on the button' },
    type: { description: 'Button type' },
    onClick: { description: 'Button press callback' },
  },
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Stop = Template.bind({});
Stop.args = {
  label: 'STOP',
  type: 'stop',
};

export const Restart = Template.bind({});
Restart.args = {
  label: 'RESTART',
  type: 'restart',
};

// export const Stop = () => <Button label="STOP" type="stop" />;
// export const Restart = () => <Button label="RESTART" type="restart" />;
