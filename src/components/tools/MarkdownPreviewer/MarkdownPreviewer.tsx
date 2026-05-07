import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { marked } from 'marked';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

const INFO_ITEMS = [
  {
    title: 'Writing Markdown',
    content: '# Heading 1, ## Heading 2, **bold**, *italic*, `code`, [link](url), ![image](url). Blank lines separate paragraphs.',
  },
  {
    title: 'Lists & tables',
    content: 'Start lines with - or * for bullet lists, 1. for numbered lists. Create tables with | Col | Col | rows and a |---|---| separator.',
  },
  {
    title: 'Code blocks',
    content: 'Wrap code in triple backticks (```) with an optional language hint (e.g. ```js) for syntax-highlighted fenced blocks in the preview.',
  },
  {
    title: 'GitHub Flavored Markdown (GFM)',
    content: 'GFM extensions are enabled: strikethrough (~~text~~), task lists (- [ ] item), auto-linking bare URLs, and table support.',
  },
];

const DEFAULT_MARKDOWN = `# Welcome to Markdown Previewer

## Features
- **Bold** and *italic* text
- \`inline code\` and code blocks
- [Links](https://example.com)
- Lists and tables

## Code Block

\`\`\`js
const hello = () => console.log('Hello, World!');
\`\`\`

## Table

| Name  | Value |
|-------|-------|
| Alpha | 1     |
| Beta  | 2     |
`;

marked.setOptions({ breaks: true, gfm: true });

function MarkdownPreviewer(): React.JSX.Element {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [syncScroll, setSyncScroll] = useState(false);
  const { copied, copy } = useClipboard();

  const html = useMemo(() => marked(markdown) as string, [markdown]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">Markdown Previewer</h2>
        <div className="d-flex gap-2 align-items-center">
          <Form.Check
            type="switch"
            id="sync-scroll"
            label="Sync scroll"
            checked={syncScroll}
            onChange={(e) => setSyncScroll(e.target.checked)}
          />
          <Button size="sm" variant="outline-secondary" onClick={() => setMarkdown('')}>
            Clear
          </Button>
          <Button size="sm" variant={copied ? 'success' : 'outline-secondary'} onClick={() => copy(markdown)}>
            {copied ? 'Copied!' : 'Copy MD'}
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setMarkdown(DEFAULT_MARKDOWN)}>
            Reset
          </Button>
        </div>
      </div>
      <Row>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="fw-semibold">Editor</Card.Header>
            <Card.Body className="p-0">
              <Form.Control
                as="textarea"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="border-0 rounded-0 h-100 output-area"
                style={{ minHeight: '500px', resize: 'none' }}
                placeholder="Write markdown here..."
                aria-label="Markdown editor"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="fw-semibold">Preview</Card.Header>
            <Card.Body>
              <div
                className="markdown-preview"
                dangerouslySetInnerHTML={{ __html: html }}
                aria-label="Markdown preview"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToolInfo items={INFO_ITEMS} />
    </div>
  );
}

export default MarkdownPreviewer;
