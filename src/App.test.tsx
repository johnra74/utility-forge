import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('qrcode.react', () => ({
  QRCodeSVG: () => <svg data-testid="qr-svg" />,
  QRCodeCanvas: ({ id }: { id: string }) => <canvas id={id} />,
}));

const renderApp = (initialPath = '/qr') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );

describe('App routing', () => {
  it('renders Home at /', () => {
    renderApp('/');
    expect(screen.getByText(/Developer tools that stay in your browser/i)).toBeInTheDocument();
  });

  it('renders QR Generator at /qr', () => {
    renderApp('/qr');
    expect(screen.getByText('QR Code Generator')).toBeInTheDocument();
  });

  it('renders Base64 Tool at /base64', () => {
    renderApp('/base64');
    expect(screen.getByText('Base64 Encoder / Decoder')).toBeInTheDocument();
  });

  it('renders Markdown Previewer at /markdown', () => {
    renderApp('/markdown');
    expect(screen.getByText('Markdown Previewer')).toBeInTheDocument();
  });

  it('renders JSON Formatter at /json', () => {
    renderApp('/json');
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
  });

  it('renders UUID Generator at /uuid', () => {
    renderApp('/uuid');
    expect(screen.getByText('UUID Generator')).toBeInTheDocument();
  });

  it('renders URL Tool at /url', () => {
    renderApp('/url');
    expect(screen.getByText('URL Encoder / Decoder')).toBeInTheDocument();
  });

  it('renders Cron Generator at /cron', () => {
    renderApp('/cron');
    expect(screen.getByText('Cron Expression Generator')).toBeInTheDocument();
  });

  it('renders Millisecond Converter at /milliseconds', () => {
    renderApp('/milliseconds');
    expect(screen.getByText('DateTime → Milliseconds Converter')).toBeInTheDocument();
  });

  it('always renders the navbar', () => {
    renderApp('/qr');
    expect(screen.getByText(/Utility Forge/)).toBeInTheDocument();
  });
});
