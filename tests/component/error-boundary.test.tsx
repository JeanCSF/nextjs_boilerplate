import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorPage from '../../app/error';

describe('ErrorPage', () => {
  it('shows a safe message without exposing internal error details', () => {
    const error = Object.assign(new Error('Internal path: C:\\private\\details'), {
      digest: 'internal-digest',
    });

    render(<ErrorPage error={error} reset={vi.fn()} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('An unexpected error occurred. Please try again.');
    expect(alert).not.toHaveTextContent(error.message);
    expect(alert).not.toHaveTextContent(error.digest ?? '');
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveClass(
      'text-primary-foreground',
    );
  });
});
