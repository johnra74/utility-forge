import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MarkdownPreviewer from './MarkdownPreviewer';

const renderTool = () => render(<MarkdownPreviewer />);

describe('MarkdownPreviewer', () => {
  it('renders the heading', () => {
    renderTool();
    expect(screen.getByText('Markdown Previewer')).toBeInTheDocument();
  });

  it('renders editor textarea', () => {
    renderTool();
    expect(screen.getByLabelText('Markdown editor')).toBeInTheDocument();
  });

  it('renders preview area', () => {
    renderTool();
    expect(screen.getByLabelText('Markdown preview')).toBeInTheDocument();
  });

  it('shows default content in editor', () => {
    renderTool();
    const editor = screen.getByLabelText('Markdown editor') as HTMLTextAreaElement;
    expect(editor.value).toContain('Welcome to Markdown Previewer');
  });

  it('renders h1 from default markdown in preview', () => {
    renderTool();
    const preview = screen.getByLabelText('Markdown preview');
    expect(preview.querySelector('h1')).not.toBeNull();
  });

  it('updates preview when editor content changes', () => {
    renderTool();
    const editor = screen.getByLabelText('Markdown editor');
    fireEvent.change(editor, { target: { value: '# Test Heading' } });
    const preview = screen.getByLabelText('Markdown preview');
    expect(preview.querySelector('h1')?.textContent).toBe('Test Heading');
  });

  it('clears editor on Clear button click', () => {
    renderTool();
    fireEvent.click(screen.getByText('Clear'));
    const editor = screen.getByLabelText('Markdown editor') as HTMLTextAreaElement;
    expect(editor.value).toBe('');
  });

  it('resets to default on Reset button click', () => {
    renderTool();
    const editor = screen.getByLabelText('Markdown editor') as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: 'custom' } });
    fireEvent.click(screen.getByText('Reset'));
    expect(editor.value).toContain('Welcome to Markdown Previewer');
  });

  it('renders sync scroll toggle', () => {
    renderTool();
    expect(screen.getByLabelText('Sync scroll')).toBeInTheDocument();
  });

  it('renders Copy MD button', () => {
    renderTool();
    expect(screen.getByText('Copy MD')).toBeInTheDocument();
  });
});
