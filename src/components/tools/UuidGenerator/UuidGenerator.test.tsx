import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UuidGenerator from './UuidGenerator';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const renderTool = () => render(<UuidGenerator />);

describe('UuidGenerator', () => {
  it('renders the heading', () => {
    renderTool();
    expect(screen.getByText('UUID Generator')).toBeInTheDocument();
  });

  it('renders v1 radio button', () => {
    renderTool();
    expect(screen.getByLabelText('V1')).toBeInTheDocument();
  });

  it('renders v4 radio button', () => {
    renderTool();
    expect(screen.getByLabelText('V4')).toBeInTheDocument();
  });

  it('generates a UUID on Generate click', () => {
    renderTool();
    fireEvent.click(screen.getByText('Generate'));
    const output = screen.getByLabelText('Generated UUID') as HTMLInputElement;
    expect(output.value).toMatch(UUID_REGEX);
  });

  it('generates a v4 UUID by default', () => {
    renderTool();
    fireEvent.click(screen.getByText('Generate'));
    const output = screen.getByLabelText('Generated UUID') as HTMLInputElement;
    expect(output.value[14]).toBe('4');
  });

  it('generates a v1 UUID when v1 is selected', () => {
    renderTool();
    fireEvent.click(screen.getByLabelText('V1'));
    fireEvent.click(screen.getByText('Generate'));
    const output = screen.getByLabelText('Generated UUID') as HTMLInputElement;
    expect(output.value[14]).toBe('1');
  });

  it('renders batch count input', () => {
    renderTool();
    expect(screen.getByLabelText('Batch count')).toBeInTheDocument();
  });

  it('generates batch UUIDs', () => {
    renderTool();
    fireEvent.click(screen.getByText(/Generate 5/));
    const batchOutput = screen.getByLabelText('Batch UUID output') as HTMLTextAreaElement;
    const lines = batchOutput.value.split('\n').filter(Boolean);
    expect(lines).toHaveLength(5);
    lines.forEach((uuid) => expect(uuid).toMatch(UUID_REGEX));
  });

  it('validates a valid UUID', () => {
    renderTool();
    const input = screen.getByLabelText('UUID validation input');
    fireEvent.change(input, { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
    expect(screen.getByText(/Valid UUID/)).toBeInTheDocument();
  });

  it('invalidates a bad UUID', () => {
    renderTool();
    const input = screen.getByLabelText('UUID validation input');
    fireEvent.change(input, { target: { value: 'not-a-uuid' } });
    expect(screen.getByText(/Invalid UUID/)).toBeInTheDocument();
  });
});
