import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from '../../src/components/theme-toggle';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});

describe('ThemeToggle', () => {
  it('switches themes and persists the selected preference', async () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    fireEvent.click(button);

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(await screen.findByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  });
});
