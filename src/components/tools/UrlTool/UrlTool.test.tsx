import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UrlTool from './UrlTool';

const renderTool = () => render(<UrlTool />);

describe('UrlTool', () => {
  it('renders the heading', () => {
    renderTool();
    expect(screen.getByText('URL Encoder / Decoder')).toBeInTheDocument();
  });

  it('renders Component tab', () => {
    renderTool();
    expect(screen.getByText('Component')).toBeInTheDocument();
  });

  it('renders Full URL tab', () => {
    renderTool();
    expect(screen.getByText('Full URL')).toBeInTheDocument();
  });

  it('renders Query Parser tab', () => {
    renderTool();
    expect(screen.getByText('Query Parser')).toBeInTheDocument();
  });

  describe('Component tab', () => {
    it('encodes text on Encode click', () => {
      renderTool();
      const input = screen.getByLabelText('URL component input');
      fireEvent.change(input, { target: { value: 'hello world' } });
      fireEvent.click(screen.getAllByText('Encode')[0]);
      expect(screen.getByLabelText('URL component output')).toHaveValue('hello%20world');
    });

    it('decodes on Decode click', () => {
      renderTool();
      const input = screen.getByLabelText('URL component input');
      fireEvent.change(input, { target: { value: 'hello%20world' } });
      fireEvent.click(screen.getAllByText('Decode')[0]);
      expect(screen.getByLabelText('URL component output')).toHaveValue('hello world');
    });

    it('shows error for invalid encoded string', () => {
      renderTool();
      const input = screen.getByLabelText('URL component input');
      fireEvent.change(input, { target: { value: '%GG' } });
      fireEvent.click(screen.getAllByText('Decode')[0]);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Full URL tab', () => {
    it('renders Full URL input when tab is clicked', () => {
      renderTool();
      fireEvent.click(screen.getByText('Full URL'));
      expect(screen.getByLabelText('Full URL input')).toBeInTheDocument();
    });
  });

  describe('Query Parser tab', () => {
    it('parses query string', () => {
      renderTool();
      fireEvent.click(screen.getByText('Query Parser'));
      const input = screen.getByLabelText('Query string input');
      fireEvent.change(input, { target: { value: '?name=Alice&age=25' } });
      fireEvent.click(screen.getByText('Parse'));
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });
});
