import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '../../app/page';

describe('Home', () => {
  it('uses the theme-aware foreground for its primary action', () => {
    render(<Home />);

    expect(screen.getByRole('link', { name: 'View the streaming example' })).toHaveClass(
      'text-primary-foreground',
    );
  });
});
