import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

const INFO_ITEMS = [
  {
    title: 'Content',
    content: 'Type or paste any text, URL, email address, phone number, or Wi-Fi credentials. The QR code updates in real time.',
  },
  {
    title: 'Error Correction',
    content: 'L (7%), M (15%), Q (25%), H (30%) — higher levels let the code remain scannable even if partially covered or damaged, but produce a denser pattern.',
  },
  {
    title: 'Size & Colors',
    content: 'Choose the export resolution (128–512 px). Foreground and background colors can be freely customised; ensure sufficient contrast for reliable scanning.',
  },
  {
    title: 'Download',
    content: 'Click "Download PNG" to save the QR code at the selected resolution. The on-screen preview is capped at 300 px for layout purposes.',
  },
];

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

const SIZES = [128, 256, 512] as const;
const ERROR_LEVELS: ErrorLevel[] = ['L', 'M', 'Q', 'H'];

function QRGenerator(): React.JSX.Element {
  const [input, setInput] = useState('https://example.com');
  const [size, setSize] = useState<number>(256);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>('M');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const { copied, copy } = useClipboard();

  const hasInput = input.trim().length > 0;

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div>
      <h2 className="mb-4">QR Code Generator</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter URL, text, or any content..."
                  aria-label="QR content"
                />
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Size (px)</Form.Label>
                  <Form.Select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    aria-label="QR size"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s} × {s}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label>Error Correction</Form.Label>
                  <Form.Select
                    value={errorLevel}
                    onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)}
                    aria-label="Error correction level"
                  >
                    {ERROR_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Foreground</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      aria-label="Foreground color"
                    />
                    <Form.Control value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                  </InputGroup>
                </Col>
                <Col>
                  <Form.Label>Background</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      aria-label="Background color"
                    />
                    <Form.Control value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body className="qr-output">
              <Card.Title>Preview</Card.Title>
              {hasInput ? (
                <>
                  <div className="d-flex justify-content-center mb-3" aria-label="QR code preview">
                    <QRCodeSVG
                      value={input}
                      size={Math.min(size, 300)}
                      level={errorLevel}
                      fgColor={fgColor}
                      bgColor={bgColor}
                    />
                  </div>
                  <div className="d-none">
                    <QRCodeCanvas
                      id="qr-canvas"
                      value={input}
                      size={size}
                      level={errorLevel}
                      fgColor={fgColor}
                      bgColor={bgColor}
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button variant="primary" onClick={downloadQR}>
                      Download PNG
                    </Button>
                    <Button
                      variant={copied ? 'success' : 'outline-secondary'}
                      onClick={() => copy(input)}
                    >
                      {copied ? 'Copied!' : 'Copy Content'}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted text-center">Enter content to generate a QR code.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToolInfo items={INFO_ITEMS} />
    </div>
  );
}

export default QRGenerator;
