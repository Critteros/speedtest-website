import Button from './Button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('displays text', () => {
    render(<Button type={'stop'} label="Stop" />);
    const button = screen.getByText(/Stop/);
    expect(button).toBeInTheDocument();
  });

  it('is clickable', async () => {
    const mockCallback = jest.fn();
    const user = userEvent.setup();

    render(<Button type={'stop'} label="Stop" onClick={mockCallback} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockCallback).toBeCalled();
  });
});
