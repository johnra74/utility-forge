import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppNavbar from './AppNavbar';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <AppNavbar />
    </MemoryRouter>
  );

describe('AppNavbar', () => {
  it('renders the brand name', () => {
    renderNavbar();
    expect(screen.getByText(/Utility Forge/i)).toBeInTheDocument();
  });

  it('renders QR Generator link', () => {
    renderNavbar();
    expect(screen.getByText('QR Generator')).toBeInTheDocument();
  });

  it('renders Base64 link', () => {
    renderNavbar();
    expect(screen.getByText('Base64')).toBeInTheDocument();
  });

  it('renders Markdown link', () => {
    renderNavbar();
    expect(screen.getByText('Markdown')).toBeInTheDocument();
  });

  it('renders JSON link', () => {
    renderNavbar();
    expect(screen.getByText('JSON')).toBeInTheDocument();
  });

  it('renders UUID link', () => {
    renderNavbar();
    expect(screen.getByText('UUID')).toBeInTheDocument();
  });

  it('renders URL Encoder link', () => {
    renderNavbar();
    expect(screen.getByText('URL Encoder')).toBeInTheDocument();
  });

  it('renders Cron Composer link', () => {
    renderNavbar();
    expect(screen.getByText('Cron Composer')).toBeInTheDocument();
  });

  it('renders DateTime → Ms link', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'DateTime → Ms' })).toBeInTheDocument();
  });
});
