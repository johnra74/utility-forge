import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CronGenerator from './CronGenerator';

const renderTool = () => render(<CronGenerator />);

describe('CronGenerator', () => {
  it('renders the heading', () => {
    renderTool();
    expect(screen.getByText('Cron Expression Generator')).toBeInTheDocument();
  });

  it('renders all cron field inputs', () => {
    renderTool();
    expect(screen.getByLabelText('Cron Minute')).toBeInTheDocument();
    expect(screen.getByLabelText('Cron Hour')).toBeInTheDocument();
    expect(screen.getByLabelText('Cron Day of Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Cron Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Cron Day of Week')).toBeInTheDocument();
  });

  it('shows default wildcard expression', () => {
    renderTool();
    expect(screen.getAllByText('* * * * *').length).toBeGreaterThan(0);
  });

  it('updates expression when field changes', () => {
    renderTool();
    const minuteField = screen.getByLabelText('Cron Minute');
    fireEvent.change(minuteField, { target: { value: '30' } });
    expect(screen.getByText('30 * * * *')).toBeInTheDocument();
  });

  it('shows human-readable description', () => {
    renderTool();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders presets list', () => {
    renderTool();
    expect(screen.getAllByText('Every minute').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Every hour').length).toBeGreaterThan(0);
  });

  it('applies preset on click', () => {
    renderTool();
    fireEvent.click(screen.getAllByText('Every hour')[0]);
    expect(screen.getAllByText('0 * * * *').length).toBeGreaterThan(0);
  });

  it('renders custom expression toggle', () => {
    renderTool();
    expect(screen.getByLabelText('Custom expression')).toBeInTheDocument();
  });

  it('shows custom expression input when toggled', () => {
    renderTool();
    fireEvent.click(screen.getByLabelText('Custom expression'));
    expect(screen.getByLabelText('Custom cron expression')).toBeInTheDocument();
  });

  it('shows error for invalid custom expression', () => {
    renderTool();
    fireEvent.click(screen.getByLabelText('Custom expression'));
    const input = screen.getByLabelText('Custom cron expression');
    fireEvent.change(input, { target: { value: 'not valid cron' } });
    const alerts = screen.getAllByRole('alert');
    const errorAlert = alerts.find((a) => a.classList.contains('alert-danger'));
    expect(errorAlert).toBeTruthy();
  });
});
