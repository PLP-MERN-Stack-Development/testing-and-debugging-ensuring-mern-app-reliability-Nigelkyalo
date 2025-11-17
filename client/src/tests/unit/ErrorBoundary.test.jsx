import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

function Boom() {
  throw new Error('Kaboom!');
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when children throw', () => {
    const onError = jest.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });

  it('allows resetting the error state', () => {
    function ThrowController() {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      return (
        <ErrorBoundary onReset={() => setShouldThrow(false)}>
          {shouldThrow ? <Boom /> : <p>Recovered</p>}
        </ErrorBoundary>
      );
    }

    render(<ThrowController />);

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByText(/recovered/i)).toBeInTheDocument();
  });
});

