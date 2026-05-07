import React, { useState, useCallback } from 'react';
import { Card, Form, Button, InputGroup, Row, Col, Alert } from 'react-bootstrap';
import { generateUuid, generateBatch, isValidUuid, UuidVersion } from '../../../services/uuidService';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

const INFO_ITEMS = [
  {
    title: 'UUID v1 (time-based)',
    content: 'Encodes the current timestamp and the machine\'s MAC address. Two v1 UUIDs generated close together can look similar in the first segments — they are still unique.',
  },
  {
    title: 'UUID v4 (random)',
    content: 'Generated from 122 bits of randomness. The most widely used version for general-purpose identifiers where time ordering is not needed.',
  },
  {
    title: 'Batch generation',
    content: 'Generate up to 100 UUIDs at once. The output is newline-separated and can be copied in one click — useful for seeding databases or test fixtures.',
  },
  {
    title: 'Format',
    content: 'UUIDs follow the pattern xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx where M is the version digit and N is the variant nibble (8, 9, a, or b).',
  },
];

const VERSION_INFO: Record<UuidVersion, string> = {
  v1: 'Time-based UUID — encodes the current timestamp and MAC address.',
  v4: 'Random UUID — generated using random or pseudo-random numbers.',
};

function UuidGenerator(): React.JSX.Element {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [single, setSingle] = useState('');
  const [batch, setBatch] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState(5);
  const [checkInput, setCheckInput] = useState('');
  const { copied, copy } = useClipboard();

  const generate = useCallback(() => {
    setSingle(generateUuid(version));
  }, [version]);

  const generateBatchUuids = useCallback(() => {
    setBatch(generateBatch(version, batchCount));
  }, [version, batchCount]);

  const checkValidity = isValidUuid(checkInput);

  return (
    <div>
      <h2 className="mb-4">UUID Generator</h2>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Version</Form.Label>
                <div className="d-flex gap-3">
                  {(['v1', 'v4'] as UuidVersion[]).map((v) => (
                    <Form.Check
                      key={v}
                      type="radio"
                      id={`uuid-${v}`}
                      label={v.toUpperCase()}
                      value={v}
                      checked={version === v}
                      onChange={() => setVersion(v)}
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">{VERSION_INFO[version]}</Form.Text>
              </Form.Group>
              <div className="d-flex gap-2 mb-3">
                <Button onClick={generate}>Generate</Button>
              </div>
              {single && (
                <InputGroup>
                  <Form.Control
                    value={single}
                    readOnly
                    className="uuid-output"
                    aria-label="Generated UUID"
                  />
                  <Button variant={copied ? 'success' : 'outline-secondary'} onClick={() => copy(single)}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </InputGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Batch Generation</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min={1}
                    max={100}
                    value={batchCount}
                    onChange={(e) => setBatchCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                    aria-label="Batch count"
                  />
                  <Button onClick={generateBatchUuids}>Generate {batchCount}</Button>
                </InputGroup>
                <Form.Text>Max 100 UUIDs at a time.</Form.Text>
              </Form.Group>
              {batch.length > 0 && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">{batch.length} UUIDs</small>
                    <Button size="sm" variant="outline-secondary" onClick={() => copy(batch.join('\n'))}>
                      Copy All
                    </Button>
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={batch.join('\n')}
                    readOnly
                    className="output-area"
                    aria-label="Batch UUID output"
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Form.Label className="fw-semibold">Validate UUID</Form.Label>
          <InputGroup>
            <Form.Control
              value={checkInput}
              onChange={(e) => setCheckInput(e.target.value)}
              placeholder="Paste a UUID to validate..."
              aria-label="UUID validation input"
            />
          </InputGroup>
          {checkInput && (
            <Alert variant={checkValidity ? 'success' : 'danger'} className="mt-2 mb-0 py-2">
              {checkValidity ? 'Valid UUID' : 'Invalid UUID format'}
            </Alert>
          )}
        </Card.Body>
      </Card>
      <ToolInfo items={INFO_ITEMS} />
    </div>
  );
}

export default UuidGenerator;
