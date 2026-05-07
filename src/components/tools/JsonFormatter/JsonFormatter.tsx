import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { formatJson, minifyJson, validateJson, getJsonStats, JsonStats } from '../../../services/jsonService';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

const INFO_ITEMS = [
  {
    title: 'Format',
    content: 'Parses the JSON and re-serialises it with consistent indentation. Choose 2 spaces (default), 4 spaces, or 1 space in the dropdown before clicking Format.',
  },
  {
    title: 'Minify',
    content: 'Strips all whitespace and newlines to produce the smallest possible JSON string — useful before embedding in HTTP payloads or config files.',
  },
  {
    title: 'Validation badge',
    content: 'A green "Valid JSON" badge appears as you type while the input is syntactically correct. Any parse error shows a red badge and an error message.',
  },
  {
    title: 'Stats',
    content: 'After formatting, Size shows the minified byte length, Keys counts every key across all nesting levels, and Depth shows the maximum nesting depth.',
  },
];

const SAMPLE_JSON = `{
  "name": "Utility Forge",
  "tools": ["QR", "Base64", "JSON"],
  "version": 1,
  "active": true
}`;

function JsonFormatter(): React.JSX.Element {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<JsonStats | null>(null);
  const { copied, copy } = useClipboard();

  const validation = input ? validateJson(input) : null;

  const format = () => {
    try {
      const result = formatJson(input, indent);
      setOutput(result);
      setStats(getJsonStats(input));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      setStats(null);
    }
  };

  const minify = () => {
    try {
      const result = minifyJson(input);
      setOutput(result);
      setStats(getJsonStats(input));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      setStats(null);
    }
  };

  const clear = () => { setInput(''); setOutput(''); setError(''); setStats(null); };

  return (
    <div>
      <h2 className="mb-4">JSON Formatter</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Input</span>
              {validation && (
                <Badge bg={validation.valid ? 'success' : 'danger'}>
                  {validation.valid ? 'Valid JSON' : 'Invalid JSON'}
                </Badge>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              <Form.Control
                as="textarea"
                value={input}
                onChange={(e) => { setInput(e.target.value); setOutput(''); setStats(null); setError(''); }}
                className="border-0 rounded-0 output-area"
                style={{ minHeight: '400px', resize: 'none' }}
                placeholder="Paste JSON here..."
                aria-label="JSON input"
              />
            </Card.Body>
            <Card.Footer className="d-flex gap-2 align-items-center">
              <Button onClick={format} size="sm">Format</Button>
              <Button onClick={minify} size="sm" variant="outline-primary">Minify</Button>
              <Form.Select
                size="sm"
                style={{ width: 'auto' }}
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                aria-label="Indent size"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 tab (as spaces)</option>
              </Form.Select>
              <Button variant="outline-secondary" size="sm" onClick={clear}>Clear</Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          {stats && (
            <div className="d-flex gap-3 mb-3">
              <Badge bg="info">Size: {stats.size}B</Badge>
              <Badge bg="secondary">Keys: {stats.keys}</Badge>
              <Badge bg="secondary">Depth: {stats.depth}</Badge>
            </div>
          )}
          {output && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Output</span>
                <Button size="sm" variant={copied ? 'success' : 'outline-secondary'} onClick={() => copy(output)}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Form.Control
                  as="textarea"
                  value={output}
                  readOnly
                  className="border-0 rounded-0 output-area"
                  style={{ minHeight: '400px', resize: 'none' }}
                  aria-label="JSON output"
                />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <ToolInfo items={INFO_ITEMS} />
    </div>
  );
}

export default JsonFormatter;
