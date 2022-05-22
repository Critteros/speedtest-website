import Meter from './Meter';
import { render, screen } from '@testing-library/react';

describe('Meter', () => {
  it('have text content', () => {
    render(<Meter type={'download'} text={'content'} />);

    const text = screen.getByText('content');
    expect(text).toBeInTheDocument();
  });
});
