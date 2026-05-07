import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MillisecondConverter from './MillisecondConverter';

const renderTool = () => render(<MillisecondConverter />);

describe('MillisecondConverter', () => {
  it('renders the heading', () => {
    renderTool();
    expect(screen.getByText('DateTime → Milliseconds Converter')).toBeInTheDocument();
  });

  it('renders the datetime input', () => {
    renderTool();
    expect(screen.getByLabelText('DateTime input')).toBeInTheDocument();
  });

  it('renders Use Now button', () => {
    renderTool();
    expect(screen.getByRole('button', { name: 'Use Now' })).toBeInTheDocument();
  });

  it('renders Convert button', () => {
    renderTool();
    expect(screen.getByRole('button', { name: 'Convert' })).toBeInTheDocument();
  });

  it('populates the input with a pre-filled datetime value on load', () => {
    renderTool();
    const input = screen.getByLabelText('DateTime input') as HTMLInputElement;
    expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('converts a known UTC datetime to epoch ms', () => {
    renderTool();
    const input = screen.getByLabelText('DateTime input');
    fireEvent.change(input, { target: { value: '1970-01-01T00:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
    expect(screen.getByText('Epoch Milliseconds')).toBeInTheDocument();
    expect(screen.getByText('Unix Seconds')).toBeInTheDocument();
  });

  it('shows result rows after conversion', () => {
    renderTool();
    const input = screen.getByLabelText('DateTime input');
    fireEvent.change(input, { target: { value: '2024-05-06T00:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
    expect(screen.getByText('ISO 8601 (UTC)')).toBeInTheDocument();
    expect(screen.getByText('UTC String')).toBeInTheDocument();
  });

  it('Convert button is disabled when input is empty', () => {
    renderTool();
    const input = screen.getByLabelText('DateTime input');
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByRole('button', { name: 'Convert' })).toBeDisabled();
  });

  it('Use Now fills input with a valid datetime-local value', () => {
    renderTool();
    const input = screen.getByLabelText('DateTime input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Use Now' }));
    expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('clears result when input changes after conversion', () => {
    renderTool();
    const input = screen.getByLabelText('DateTime input');
    fireEvent.change(input, { target: { value: '2024-05-06T00:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
    expect(screen.getByText('Epoch Milliseconds')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '2024-06-01T00:00' } });
    expect(screen.queryByText('Epoch Milliseconds')).not.toBeInTheDocument();
  });

  it('renders ToolInfo section', () => {
    renderTool();
    expect(screen.getByText(/How to use/i)).toBeInTheDocument();
  });

  describe('mode toggle', () => {
    it('renders both mode toggle buttons', () => {
      renderTool();
      expect(screen.getByRole('button', { name: 'DateTime → Ms' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ms → DateTime' })).toBeInTheDocument();
    });

    it('starts in DateTime → Ms mode showing datetime-local input', () => {
      renderTool();
      expect(screen.getByText('DateTime → Milliseconds Converter')).toBeInTheDocument();
      expect(screen.getByLabelText('DateTime input')).toBeInTheDocument();
    });

    it('switches heading and input when Ms → DateTime is clicked', () => {
      renderTool();
      fireEvent.click(screen.getByRole('button', { name: 'Ms → DateTime' }));
      expect(screen.getByText('Milliseconds → DateTime Converter')).toBeInTheDocument();
      expect(screen.getByLabelText('Milliseconds input')).toBeInTheDocument();
    });

    it('Convert button is disabled when ms input is empty', () => {
      renderTool();
      fireEvent.click(screen.getByRole('button', { name: 'Ms → DateTime' }));
      expect(screen.getByRole('button', { name: 'Convert' })).toBeDisabled();
    });

    it('converts milliseconds to datetime and shows result rows', () => {
      renderTool();
      fireEvent.click(screen.getByRole('button', { name: 'Ms → DateTime' }));
      fireEvent.change(screen.getByLabelText('Milliseconds input'), { target: { value: '0' } });
      fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
      expect(screen.getByText('ISO 8601 (UTC)')).toBeInTheDocument();
      expect(screen.getByText('UTC String')).toBeInTheDocument();
      expect(screen.getByText('Local DateTime')).toBeInTheDocument();
      expect(screen.getByText('DateTime-Local')).toBeInTheDocument();
    });

    it('clears epoch results when switching to Ms → DateTime mode', () => {
      renderTool();
      fireEvent.change(screen.getByLabelText('DateTime input'), { target: { value: '2024-05-06T00:00' } });
      fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
      expect(screen.getByText('Unix Seconds')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Ms → DateTime' }));
      expect(screen.queryByText('Unix Seconds')).not.toBeInTheDocument();
    });

    it('clears datetime results when switching back to DateTime → Ms mode', () => {
      renderTool();
      fireEvent.click(screen.getByRole('button', { name: 'Ms → DateTime' }));
      fireEvent.change(screen.getByLabelText('Milliseconds input'), { target: { value: '1715040000000' } });
      fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
      expect(screen.getByText('Local DateTime')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'DateTime → Ms' }));
      expect(screen.queryByText('Local DateTime')).not.toBeInTheDocument();
    });

    it('clears result when ms input changes after conversion', () => {
      renderTool();
      fireEvent.click(screen.getByRole('button', { name: 'Ms → DateTime' }));
      fireEvent.change(screen.getByLabelText('Milliseconds input'), { target: { value: '1715040000000' } });
      fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
      expect(screen.getByText('ISO 8601 (UTC)')).toBeInTheDocument();
      fireEvent.change(screen.getByLabelText('Milliseconds input'), { target: { value: '0' } });
      expect(screen.queryByText('ISO 8601 (UTC)')).not.toBeInTheDocument();
    });

    it('shows Ms → DateTime ToolInfo content after switching mode', () => {
      renderTool();
      fireEvent.click(screen.getByRole('button', { name: 'Ms → DateTime' }));
      expect(screen.getByText('Epoch milliseconds')).toBeInTheDocument();
    });
  });
});
