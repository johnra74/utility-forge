import React, { useState, useCallback } from 'react';
import { Form, Button, Card, Alert, Tab, Tabs, Badge } from 'react-bootstrap';
import { encodeText, decodeText, encodeFile } from '../../../services/base64Service';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

const INFO_ITEMS = [
  {
    title: 'Text tab',
    content: 'Paste plain text and click Encode to convert it to Base64. Paste a Base64 string and click Decode to recover the original text. Supports full UTF-8.',
  },
  {
    title: 'File tabs (Image, Audio, Video, PDF)',
    content: 'Select a file to encode it as a Base64 data URL. A live preview is shown inline. Copy the Base64-only portion (after the comma) for embedding in code or APIs.',
  },
  {
    title: 'Data URL format',
    content: 'Encoded files follow the format: data:<mime-type>;base64,<data>. Strip the prefix if your target system expects raw Base64 only.',
  },
  {
    title: 'Common uses',
    content: 'Embedding images in CSS/HTML, transmitting binary data over JSON APIs, storing small files in databases, and generating email attachments.',
  },
];

interface FileFormat {
  value: string;
  label: string;
  accept: string;
}

const FILE_FORMATS: FileFormat[] = [
  { value: 'image', label: 'Image', accept: 'image/*' },
  { value: 'audio', label: 'Audio', accept: 'audio/*' },
  { value: 'video', label: 'Video', accept: 'video/*' },
  { value: 'pdf', label: 'PDF', accept: 'application/pdf' },
  { value: 'file', label: 'Any File', accept: '*/*' },
];

function TextTab(): React.JSX.Element {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { copied, copy } = useClipboard();

  const encode = () => {
    try {
      setError('');
      setOutput(encodeText(input));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const decode = () => {
    try {
      setError('');
      setOutput(decodeText(input));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const clear = () => { setInput(''); setOutput(''); setError(''); };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Input</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or Base64 to decode..."
          className="output-area"
          aria-label="Text input"
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
          <Form.Control as="textarea" rows={5} value={output} readOnly className="output-area" aria-label="Text output" />
        </Form.Group>
      )}
    </div>
  );
}

interface FileTabProps {
  format: FileFormat;
}

function FileTabForFormat({ format }: FileTabProps): React.JSX.Element {
  const [dataUrl, setDataUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { copied, copy } = useClipboard();

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const result = await encodeFile(file);
      setDataUrl(result);
      setFileName(file.name);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const b64Only = dataUrl.split(',')[1] ?? '';

  const renderPreview = () => {
    if (!dataUrl) return null;
    if (format.value === 'image') return <img src={dataUrl} alt={fileName} className="img-fluid mt-2 rounded" style={{ maxHeight: 300 }} />;
    if (format.value === 'audio') return <audio controls src={dataUrl} className="w-100 mt-2" />;
    if (format.value === 'video') return <video controls src={dataUrl} className="w-100 mt-2" style={{ maxHeight: 300 }} />;
    if (format.value === 'pdf') return <embed src={dataUrl} type="application/pdf" width="100%" height="400px" className="mt-2" />;
    return null;
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Select {format.label} File</Form.Label>
        <Form.Control
          type="file"
          accept={format.accept}
          onChange={handleFile}
          aria-label={`${format.label} file upload`}
        />
      </Form.Group>
      {loading && <Alert variant="info">Reading file…</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {dataUrl && (
        <>
          {renderPreview()}
          <Form.Group className="mt-3">
            <Form.Label>
              Base64 Output <Badge bg="secondary">{b64Only.length} chars</Badge>
              <Button size="sm" variant="outline-success" className="ms-2" onClick={() => copy(b64Only)}>
                {copied ? 'Copied!' : 'Copy Base64'}
              </Button>
            </Form.Label>
            <Form.Control as="textarea" rows={4} value={b64Only} readOnly className="output-area" aria-label={`${format.label} base64 output`} />
          </Form.Group>
        </>
      )}
    </div>
  );
}

function Base64Tool(): React.JSX.Element {
  return (
    <div>
      <h2 className="mb-4">Base64 Encoder / Decoder</h2>
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="text" className="mb-3">
            <Tab eventKey="text" title="Text">
              <TextTab />
            </Tab>
            {FILE_FORMATS.map((f) => (
              <Tab key={f.value} eventKey={f.value} title={f.label}>
                <FileTabForFormat format={f} />
              </Tab>
            ))}
          </Tabs>
        </Card.Body>
      </Card>
      <ToolInfo items={INFO_ITEMS} />
    </div>
  );
}

export default Base64Tool;
