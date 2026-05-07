import React, { useState, useMemo } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge, ListGroup } from 'react-bootstrap';
import {
  buildCronExpression,
  describeCron,
  validateCronField,
  CRON_PRESETS,
  CronFields,
} from '../../../services/cronService';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

const INFO_ITEMS = [
  {
    title: 'Field order',
    content: 'Fields run left to right: Minute (0–59) · Hour (0–23) · Day of Month (1–31) · Month (1–12) · Day of Week (0–7, where 0 and 7 are both Sunday).',
  },
  {
    title: 'Special characters',
    content: '* means "every", */n means "every n units" (e.g. */15 = every 15 minutes), ranges use a dash (1-5), and lists use a comma (1,3,5).',
  },
  {
    title: 'Presets',
    content: 'Click any preset to populate the fields instantly. Presets cover the most common schedules — you can then fine-tune individual fields after applying one.',
  },
  {
    title: 'Custom expression',
    content: 'Toggle "Custom expression" to type a raw cron string directly. The human-readable description below updates in real time and flags any invalid syntax.',
  },
];

interface FieldConfig {
  key: keyof CronFields;
  label: string;
  min: number;
  max: number;
  placeholder: string;
}

const FIELDS: FieldConfig[] = [
  { key: 'minute', label: 'Minute', min: 0, max: 59, placeholder: '0-59, *, */5' },
  { key: 'hour', label: 'Hour', min: 0, max: 23, placeholder: '0-23, *, */2' },
  { key: 'day', label: 'Day of Month', min: 1, max: 31, placeholder: '1-31, *' },
  { key: 'month', label: 'Month', min: 1, max: 12, placeholder: '1-12, *' },
  { key: 'weekday', label: 'Day of Week', min: 0, max: 7, placeholder: '0-7, * (0=Sun)' },
];

const INITIAL: CronFields = { minute: '*', hour: '*', day: '*', month: '*', weekday: '*' };

function CronGenerator(): React.JSX.Element {
  const [fields, setFields] = useState<CronFields>(INITIAL);
  const [customExpr, setCustomExpr] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const { copied, copy } = useClipboard();

  const expression = useCustom
    ? customExpr
    : buildCronExpression(fields);

  const { description, error } = useMemo(() => describeCron(expression), [expression]);

  const fieldErrors = useMemo<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        FIELDS.map(({ key, min, max }) => [key, !validateCronField(fields[key], min, max)])
      ),
    [fields]
  );

  const setField = (key: keyof CronFields, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const applyPreset = (value: string) => {
    const parts = value.split(' ');
    if (parts.length !== 5) return;
    const [minute, hour, day, month, weekday] = parts;
    setFields({ minute, hour, day, month, weekday });
    setUseCustom(false);
  };

  return (
    <div>
      <h2 className="mb-4">Cron Expression Generator</h2>
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Fields</Card.Title>
                <Form.Check
                  type="switch"
                  id="use-custom"
                  label="Custom expression"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                />
              </div>
              {useCustom ? (
                <Form.Group>
                  <Form.Label>Custom Cron Expression</Form.Label>
                  <Form.Control
                    value={customExpr}
                    onChange={(e) => setCustomExpr(e.target.value)}
                    placeholder="* * * * *"
                    className="output-area"
                    aria-label="Custom cron expression"
                  />
                  <Form.Text>Format: minute hour day-of-month month day-of-week</Form.Text>
                </Form.Group>
              ) : (
                <Row>
                  {FIELDS.map(({ key, label, placeholder }) => (
                    <Col md={4} key={key} className="mb-3 cron-field">
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        value={fields[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        placeholder={placeholder}
                        isInvalid={fieldErrors[key]}
                        aria-label={`Cron ${label}`}
                      />
                      <Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
                    </Col>
                  ))}
                </Row>
              )}
              <div className="mt-3 p-3 bg-dark rounded d-flex justify-content-between align-items-center">
                <code className="text-light fs-5">{expression}</code>
                <Button
                  size="sm"
                  variant={copied ? 'success' : 'outline-light'}
                  onClick={() => copy(expression)}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              {error ? (
                <Alert variant="danger" className="mt-2 mb-0 py-2">{error}</Alert>
              ) : description ? (
                <Alert variant="success" className="mt-2 mb-0 py-2">{description}</Alert>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card>
            <Card.Header className="fw-semibold">Presets</Card.Header>
            <ListGroup variant="flush">
              {CRON_PRESETS.map(({ label, value }) => (
                <ListGroup.Item
                  key={value}
                  action
                  onClick={() => applyPreset(value)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{label}</span>
                  <Badge bg="secondary" className="output-area">{value}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <ToolInfo items={INFO_ITEMS} />
    </div>
  );
}

export default CronGenerator;
