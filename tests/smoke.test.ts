import { describe, it, expect } from 'vitest';
import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PROFILE } from '@/constants';

// Test component using React.createElement to support standard .ts extension without JSX transform
const SmokeTestWidget: React.FC<{ initialCount?: number }> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);
  const [active, setActive] = useState(false);

  return React.createElement(
    'div',
    { 'data-testid': 'smoke-widget' },
    React.createElement('h1', null, 'Vitest & React Smoke Test'),
    React.createElement('p', { 'data-testid': 'counter' }, `Count: ${count}`),
    React.createElement('button', { onClick: () => setCount((c) => c + 1) }, 'Increment'),
    React.createElement('button', { onClick: () => setActive(!active) }, 'Toggle Status'),
    active ? React.createElement('span', { 'data-testid': 'active-badge' }, 'Active') : null,
    React.createElement('div', { 'data-testid': 'profile-name' }, PROFILE.name)
  );
};

describe('Smoke Test Suite', () => {
  it('executes basic vitest assertions cleanly', () => {
    expect(1 + 1).toBe(2);
    expect(true).toBe(true);
    expect(PROFILE).toBeDefined();
    expect(PROFILE.name).toBe('Srinivasa Manikanta Rajapantula');
  });

  it('provides full JSDOM DOM environment and custom DOM matchers', () => {
    const div = document.createElement('div');
    div.id = 'jsdom-test-node';
    div.textContent = 'JSDOM Environment Active';
    document.body.appendChild(div);

    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent('JSDOM Environment Active');
    expect(div).toHaveAttribute('id', 'jsdom-test-node');

    document.body.removeChild(div);
  });

  it('provides configured DOM API mocks (matchMedia, IntersectionObserver, ResizeObserver, scrollTo)', () => {
    // matchMedia mock
    expect(window.matchMedia).toBeDefined();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    expect(mediaQuery.matches).toBe(false);
    expect(typeof mediaQuery.addEventListener).toBe('function');

    // IntersectionObserver mock
    expect(window.IntersectionObserver).toBeDefined();
    const observer = new window.IntersectionObserver(() => {});
    expect(typeof observer.observe).toBe('function');
    expect(typeof observer.disconnect).toBe('function');

    // ResizeObserver mock
    expect(window.ResizeObserver).toBeDefined();
    const resizeObserver = new window.ResizeObserver(() => {});
    expect(typeof resizeObserver.observe).toBe('function');
    expect(typeof resizeObserver.disconnect).toBe('function');

    // scrollTo mock
    expect(window.scrollTo).toBeDefined();
    expect(() => window.scrollTo(0, 100)).not.toThrow();
  });

  it('renders React components into the DOM via Testing Library', () => {
    render(React.createElement(SmokeTestWidget));

    expect(screen.getByTestId('smoke-widget')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vitest & React Smoke Test');
    expect(screen.getByTestId('counter')).toHaveTextContent('Count: 0');
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Srinivasa Manikanta Rajapantula');
  });

  it('handles user events and state updates properly', async () => {
    const user = userEvent.setup();
    render(React.createElement(SmokeTestWidget, { initialCount: 5 }));

    expect(screen.getByTestId('counter')).toHaveTextContent('Count: 5');

    const incrementBtn = screen.getByRole('button', { name: /increment/i });
    await user.click(incrementBtn);
    expect(screen.getByTestId('counter')).toHaveTextContent('Count: 6');

    const toggleBtn = screen.getByRole('button', { name: /toggle status/i });
    expect(screen.queryByTestId('active-badge')).not.toBeInTheDocument();

    await user.click(toggleBtn);
    expect(screen.getByTestId('active-badge')).toBeInTheDocument();
  });

  it('resolves typescript path aliases using "@/" correctly', () => {
    expect(PROFILE.email).toContain('@');
    expect(Array.isArray(PROFILE.socials)).toBe(true);
    expect(PROFILE.socials.length).toBeGreaterThan(0);
  });
});
