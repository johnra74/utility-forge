import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Tab, Tabs } from 'react-bootstrap';
import { encodeUrl, decodeUrl, encodeUrlFull, decodeUrlFull, parseQueryString } from '../../../services/urlService';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

const INFO_ITEMS = [
  {
    title: 'Component tab (encodeURIComponent)',
    content: 'Encodes every character that is not a letter, digit, or - _ . ! ~ * \' ( ). Use this for individual query-string values, path segments, or form fields.',
  },
  {
    title: 'Full URL tab (encodeURI)',
    content: 'Preserves protocol (https://), slashes, and delimiters (?, &, =) so the URL remains valid. Use this when encoding an entire URL rather than a single value.',
  },
  {
    title: 'Query Parser tab',
    content: 'Paste a query string (with or without the leading ?) to split it into key-value pairs. Values are automatically decoded from percent-encoding and + spaces.',
  },
  {
    title: 'When to use which',
    content: 'Rule of thumb: encode individual values with Component, encode full URLs with Full URL, and inspect what a query string contains with Query Parser.',
  },
];

function ComponentTab(): React.JSX.Element {
  const [input, setInput] = useState('hello world / foo=bar&baz=qux');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { copied, copy } = useClipboard();

  const encode = () => {
    try { setError(''); setOutput(encodeUrl(input)); } catch (e) { setError((e as Error).message); }
  };
  const decode = () => {
    try { setError(''); setOutput(decodeUrl(input)); } catch (e) { setError((e as Error).message); }
  };
  const clear = () => { setInput(''); setOutput(''); setError(''); };

  return (
    <div>
      <p className="text-muted small">Encodes/decodes individual components (encodeURIComponent).</p>
      <Form.Group className="mb-3">
        <Form.Label>Input</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="URL component input"
        />
      </Form.Group>
      <div className="d-flex gap-2 mb-3">
        <Button onClick={encode} disabled={!input}>Encode</Button>
        <Button variant="outline-primary" onClick={decode} disabled={!input}>Decode</Button>
        <Button variant="outline-secondary" onClick={clear}>Clear</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {output && (
        <Form.Group>
          <Form.Label>
            Output
            <Button size="sm" variant="outline-success" className="ms-2" onClick={() => copy(output)}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Form.Label>
          <Form.Control as="textarea" rows={3} value={output} readOnly className="output-area" aria-label="URL component output" />
        </Form.Group>
      )}
    </div>
  );
}

function FullUrlTab(): React.JSX.Element {
  const [input, setInput] = useState('https://example.com/path with spaces?q=hello world');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { copied, copy } = useClipboard();

  const encode = () => {
    try { setError(''); setOutput(encodeUrlFull(input)); } catch (e) { setError((e as Error).message); }
  };
  const decode = () => {
    try { setError(''); setOutput(decodeUrlFull(input)); } catch (e) { setError((e as Error).message); }
  };

  return (
    <div>
      <p className="text-muted small">Encodes/decodes full URLs (encodeURI) — preserves protocol, slashes, and query separators.</p>
      <Form.Group className="mb-3">
        <Form.Label>URL</Form.Label>
        <Form.Control
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Full URL input"
        />
      </Form.Group>
      <div className="d-flex gap-2 mb-3">
        <Button onClick={encode} disabled={!input}>Encode</Button>
        <Button variant="outline-primary" onClick={decode} disabled={!input}>Decode</Button>
        <Button variant="outline-secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>Clear</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {output && (
        <Form.Group>
          <Form.Label>
            Result
            <Button size="sm" variant="outline-success" className="ms-2" onClick={() => copy(output)}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Form.Label>
          <Form.Control value={output} readOnly className="output-area" aria-label="Full URL output" />
        </Form.Group>
      )}
    </div>
  );
}

function QueryParserTab(): React.JSX.Element {
  const [input, setInput] = useState('?name=John+Doe&age=30&city=New%20York');
  const [parsed, setParsed] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');

  const parse = () => {
    try {
      setError('');
      setParsed(parseQueryString(input));
    } catch (e) {
      setError((e as Error).message);
      setParsed(null);
    }
  };

  return (
    <div>
      <p className="text-muted small">Parse query string parameters into key-value pairs.</p>
      <Form.Group className="mb-3">
        <Form.Label>Query String</Form.Label>
        <Form.Control
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="?key=value&foo=bar"
          aria-label="Query string input"
        />
      </Form.Group>
      <Button onClick={parse} disabled={!input} className="mb-3">Parse</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {parsed && (
        <div>
          {Object.entries(parsed).map(([k, v]) => (
            <Row key={k} className="mb-2">
              <Col md={4}><code className="text-primary">{k}</code></Col>
              <Col><code>{v}</code></Col>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

function UrlTool(): React.JSX.Element {
  return (
    <div>
      <h2 className="mb-4">URL Encoder / Decoder</h2>
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="component" className="mb-3">
            <Tab eventKey="component" title="Component">
              <ComponentTab />
            </Tab>
            <Tab eventKey="full" title="Full URL">
              <FullUrlTab />
            </Tab>
            <Tab eventKey="query" title="Query Parser">
              <QueryParserTab />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      <ToolInfo items={INFO_ITEMS} />
    </div>
  );
}

export default UrlTool;
