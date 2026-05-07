import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QRGenerator from './QRGenerator';

vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => <svg data-testid="qr-svg" aria-label={`QR: ${value}`} />,
  QRCodeCanvas: ({ id }: { id: string }) => <canvas id={id} data-testid="qr-canvas" />,
}));

const renderQR = () =>
  render(
    <MemoryRouter>
      <QRGenerator />
    </MemoryRouter>
  );

describe('QRGenerator', () => {
  it('renders the heading', () => {
    renderQR();
    expect(screen.getByText('QR Code Generator')).toBeInTheDocument();
  });

  it('renders the content textarea', () => {
    renderQR();
    expect(screen.getByLabelText('QR content')).toBeInTheDocument();
  });

  it('renders QR preview for default value', () => {
    renderQR();
    expect(screen.getByTestId('qr-svg')).toBeInTheDocument();
  });

  it('shows placeholder message when input is empty', () => {
    renderQR();
    const textarea = screen.getByLabelText('QR content');
    fireEvent.change(textarea, { target: { value: '' } });
    expect(screen.getByText(/Enter content to generate/i)).toBeInTheDocument();
  });

  it('updates QR when content changes', () => {
    renderQR();
    const textarea = screen.getByLabelText('QR content');
    fireEvent.change(textarea, { target: { value: 'new content' } });
    expect(screen.getByTestId('qr-svg')).toBeInTheDocument();
  });

  it('renders size select', () => {
    renderQR();
    expect(screen.getByLabelText('QR size')).toBeInTheDocument();
  });

  it('renders error correction select', () => {
    renderQR();
    expect(screen.getByLabelText('Error correction level')).toBeInTheDocument();
  });

  it('renders foreground color picker', () => {
    renderQR();
    expect(screen.getByLabelText('Foreground color')).toBeInTheDocument();
  });

  it('renders background color picker', () => {
    renderQR();
    expect(screen.getByLabelText('Background color')).toBeInTheDocument();
  });

  it('renders Download PNG button', () => {
    renderQR();
    expect(screen.getByText('Download PNG')).toBeInTheDocument();
  });
});
