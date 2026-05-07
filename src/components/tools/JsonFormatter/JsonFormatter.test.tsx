import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JsonFormatter from './JsonFormatter';

const renderTool = () => render(<JsonFormatter />);

describe('JsonFormatter', () => {
  it('renders the heading', () => {
    renderTool();
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
  });

  it('renders JSON input area', () => {
    renderTool();
    expect(screen.getByLabelText('JSON input')).toBeInTheDocument();
  });

  it('shows Valid JSON badge for default content', () => {
    renderTool();
    expect(screen.getByText('Valid JSON')).toBeInTheDocument();
  });

  it('formats JSON on Format button click', () => {
    renderTool();
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));
    expect(screen.getByLabelText('JSON output')).toBeInTheDocument();
  });

  it('minifies JSON on Minify button click', () => {
    renderTool();
    fireEvent.click(screen.getByRole('button', { name: 'Minify' }));
    const output = screen.getByLabelText('JSON output') as HTMLTextAreaElement;
    expect(output.value).not.toContain('\n');
  });

  it('shows error for invalid JSON', () => {
    renderTool();
    const input = screen.getByLabelText('JSON input');
    fireEvent.change(input, { target: { value: '{invalid}' } });
    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows stats after formatting', () => {
    renderTool();
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));
    expect(screen.getByText(/Size:/)).toBeInTheDocument();
    expect(screen.getByText(/Keys:/)).toBeInTheDocument();
    expect(screen.getByText(/Depth:/)).toBeInTheDocument();
  });

  it('clears output on Clear button click', () => {
    renderTool();
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByLabelText('JSON output')).not.toBeInTheDocument();
  });

  it('renders indent size select', () => {
    renderTool();
    expect(screen.getByLabelText('Indent size')).toBeInTheDocument();
  });
});
