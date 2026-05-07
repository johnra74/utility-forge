import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe('Home', () => {
  it('renders the main heading', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /Developer tools that stay in your browser/i })).toBeInTheDocument();
  });

  it('renders the hero description mentioning no backend', () => {
    renderHome();
    expect(document.body.textContent).toMatch(/no backend/i);
  });

  it('renders the Why it matters section', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /Why it matters/i })).toBeInTheDocument();
  });

  it('renders all four benefit cards', () => {
    renderHome();
    expect(screen.getByText('Nothing leaves your network')).toBeInTheDocument();
    expect(screen.getByText('Enterprise and DLP safe')).toBeInTheDocument();
    expect(screen.getByText('Works offline')).toBeInTheDocument();
    expect(screen.getByText('Fully auditable')).toBeInTheDocument();
  });

  it('renders the Available tools section', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /Available tools/i })).toBeInTheDocument();
  });

  it('renders a card for every tool', () => {
    renderHome();
    expect(screen.getByText('QR Generator')).toBeInTheDocument();
    expect(screen.getByText('Base64 Encoder / Decoder')).toBeInTheDocument();
    expect(screen.getByText('Markdown Previewer')).toBeInTheDocument();
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
    expect(screen.getByText('UUID Generator')).toBeInTheDocument();
    expect(screen.getByText('URL Encoder / Decoder')).toBeInTheDocument();
    expect(screen.getByText('Cron Composer')).toBeInTheDocument();
    expect(screen.getByText('DateTime ↔ Ms Converter')).toBeInTheDocument();
  });

  it('tool cards link to the correct routes', () => {
    renderHome();
    const qrLink = screen.getByRole('link', { name: /QR Generator/i });
    expect(qrLink).toHaveAttribute('href', '/qr');
    const jsonLink = screen.getByRole('link', { name: /JSON Formatter/i });
    expect(jsonLink).toHaveAttribute('href', '/json');
  });

  it('mentions data egress in the enterprise context', () => {
    renderHome();
    expect(screen.getByText(/data egress/i)).toBeInTheDocument();
  });
});
