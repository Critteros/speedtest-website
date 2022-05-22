import Gauge from './Gauge';
import { render, screen } from '@testing-library/react';

describe('Gauge', () => {
  it('displays value', () => {
    render(<Gauge id={'test'} value={30} maxValue={100} />);

    const text = screen.getByText(/30/);
    expect(text).toBeInTheDocument();
  });

  it('displays text with postfix', () => {
    render(<Gauge id={'test'} value={30} maxValue={100} postfix="Mb/s" />);

    const text = screen.getByText(/30/);
    expect(text).toBeInTheDocument();

    expect(text).toHaveTextContent('Mb/s');
  });
});
