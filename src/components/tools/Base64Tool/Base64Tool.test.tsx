import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Base64Tool from './Base64Tool';

const renderTool = () => render(<Base64Tool />);

describe('Base64Tool — Text tab', () => {
  it('renders the heading', () => {
    renderTool();
    expect(screen.getByText('Base64 Encoder / Decoder')).toBeInTheDocument();
  });

  it('renders the text input', () => {
    renderTool();
    expect(screen.getByLabelText('Text input')).toBeInTheDocument();
  });

  it('encodes text on Encode click', async () => {
    renderTool();
    const input = screen.getByLabelText('Text input');
    await userEvent.type(input, 'hello');
    fireEvent.click(screen.getByText('Encode'));
    await waitFor(() => {
      expect(screen.getByLabelText('Text output')).toHaveValue('aGVsbG8=');
    });
  });

  it('decodes base64 on Decode click', async () => {
    renderTool();
    const input = screen.getByLabelText('Text input');
    await userEvent.type(input, 'aGVsbG8=');
    fireEvent.click(screen.getByText('Decode'));
    await waitFor(() => {
      expect(screen.getByLabelText('Text output')).toHaveValue('hello');
    });
  });

  it('shows error for invalid base64 decode', async () => {
    renderTool();
    const input = screen.getByLabelText('Text input');
    await userEvent.type(input, '!!!invalid!!!');
    fireEvent.click(screen.getByText('Decode'));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('clears input and output on Clear click', async () => {
    renderTool();
    const input = screen.getByLabelText('Text input');
    await userEvent.type(input, 'hello');
    fireEvent.click(screen.getByText('Encode'));
    await waitFor(() => screen.getByLabelText('Text output'));
    fireEvent.click(screen.getByText('Clear'));
    expect(input).toHaveValue('');
  });

  it('Encode button is disabled when input is empty', () => {
    renderTool();
    expect(screen.getAllByText('Encode')[0].closest('button')).toBeDisabled();
  });
});

describe('Base64Tool — File tabs', () => {
  it('renders Image tab', () => {
    renderTool();
    expect(screen.getByText('Image')).toBeInTheDocument();
  });

  it('renders Audio tab', () => {
    renderTool();
    expect(screen.getByText('Audio')).toBeInTheDocument();
  });

  it('renders Video tab', () => {
    renderTool();
    expect(screen.getByText('Video')).toBeInTheDocument();
  });

  it('renders PDF tab', () => {
    renderTool();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('renders Any File tab', () => {
    renderTool();
    expect(screen.getByText('Any File')).toBeInTheDocument();
  });
});
