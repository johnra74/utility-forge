import React, { useState } from 'react';
import { Card, Form, Button, Table, InputGroup, Alert, ButtonGroup } from 'react-bootstrap';
import {
  convertDateTimeToMs,
  convertMsToDateTime,
  nowAsDateTimeLocal,
  isValidDateTimeString,
  isValidMillisecondInput,
  EpochResult,
  DateTimeResult,
} from '../../../services/millisecondService';
import useClipboard from '../../../hooks/useClipboard';
import ToolInfo from '../../layout/ToolInfo';

type Mode = 'to-ms' | 'to-datetime';

const TO_MS_INFO = [
  {
    title: 'Input format',
    content: "Pick any date and time using the browser's native date/time picker, or type directly in YYYY-MM-DDTHH:mm format. Seconds and timezone offsets are also accepted.",
  },
  {
    title: 'Use Now',
    content: 'Fills the input with the current local date and time so you can immediately see the epoch values for "right now".',
  },
  {
    title: 'Milliseconds vs Unix seconds',
    content: "Epoch milliseconds (used by JavaScript's Date.now()) are 1 000× larger than Unix seconds (used by most server-side systems and databases).",
  },
  {
    title: 'UTC vs local time',
    content: 'The picker interprets your input as local time. The ISO 8601 and UTC outputs show the equivalent absolute time, independent of timezone.',
  },
];

const TO_DATETIME_INFO = [
  {
    title: 'Epoch milliseconds',
    content: "Enter the number of milliseconds since 1970-01-01T00:00:00 UTC (the Unix epoch). JavaScript's Date.now() returns this value.",
  },
  {
    title: 'Unix seconds vs milliseconds',
    content: 'If you have a Unix timestamp in seconds, multiply by 1000 before pasting here. A 10-digit number is seconds; 13-digit is milliseconds.',
  },
  {
    title: 'Local vs UTC',
    content: "Local DateTime shows the time in your browser's timezone. ISO 8601 and UTC String are always expressed in UTC.",
  },
  {
    title: 'DateTime-Local format',
    content: 'The YYYY-MM-DDTHH:mm value can be pasted directly into a datetime-local HTML input field.',
  },
];

interface ResultRowProps {
  label: string;
  value: string;
  onCopy: (value: string) => void;
  copied: boolean;
}

function ResultRow({ label, value, onCopy, copied }: ResultRowProps): React.JSX.Element {
  return (
    <tr>
      <td className="fw-semibold text-nowrap">{label}</td>
      <td className="output-area">{value}</td>
      <td>
        <Button size="sm" variant={copied ? 'success' : 'outline-secondary'} onClick={() => onCopy(value)}>
          {copied ? '✓' : 'Copy'}
        </Button>
      </td>
    </tr>
  );
}

interface OutputRow {
  key: string;
  label: string;
  value: string;
}

function buildEpochRows(result: EpochResult): OutputRow[] {
  return [
    { key: 'ms', label: 'Epoch Milliseconds', value: String(result.milliseconds) },
    { key: 'unix', label: 'Unix Seconds', value: String(result.unix) },
    { key: 'utcIso', label: 'ISO 8601 (UTC)', value: result.utcIso },
    { key: 'utc', label: 'UTC String', value: result.utc },
  ];
}

function buildDateTimeRows(result: DateTimeResult): OutputRow[] {
  return [
    { key: 'iso', label: 'ISO 8601 (UTC)', value: result.utcIso },
    { key: 'utc', label: 'UTC String', value: result.utc },
    { key: 'local', label: 'Local DateTime', value: result.local },
    { key: 'dtLocal', label: 'DateTime-Local', value: result.dateTimeLocal },
  ];
}

function MillisecondConverter(): React.JSX.Element {
  const [mode, setMode] = useState<Mode>('to-ms');
  const [dateInput, setDateInput] = useState(nowAsDateTimeLocal());
  const [msInput, setMsInput] = useState('');
  const [epochResult, setEpochResult] = useState<EpochResult | null>(null);
  const [dateTimeResult, setDateTimeResult] = useState<DateTimeResult | null>(null);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const { copy } = useClipboard();

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setEpochResult(null);
    setDateTimeResult(null);
    setError('');
  };

  const isDateValid = isValidDateTimeString(dateInput);
  const isMsValid = isValidMillisecondInput(msInput);

  const convert = () => {
    try {
      setError('');
      if (mode === 'to-ms') {
        setEpochResult(convertDateTimeToMs(dateInput));
      } else {
        setDateTimeResult(convertMsToDateTime(msInput));
      }
    } catch (e) {
      setError((e as Error).message);
      setEpochResult(null);
      setDateTimeResult(null);
    }
  };

  const copyField = async (key: string, value: string) => {
    await copy(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const useNow = () => {
    setDateInput(nowAsDateTimeLocal());
    setEpochResult(null);
    setError('');
  };

  const rows: OutputRow[] | null =
    mode === 'to-ms' && epochResult ? buildEpochRows(epochResult) :
    mode === 'to-datetime' && dateTimeResult ? buildDateTimeRows(dateTimeResult) :
    null;

  const heading = mode === 'to-ms'
    ? 'DateTime → Milliseconds Converter'
    : 'Milliseconds → DateTime Converter';

  return (
    <div>
      <h2 className="mb-3">{heading}</h2>
      <ButtonGroup className="mb-4">
        <Button
          variant={mode === 'to-ms' ? 'primary' : 'outline-primary'}
          onClick={() => switchMode('to-ms')}
        >
          DateTime → Ms
        </Button>
        <Button
          variant={mode === 'to-datetime' ? 'primary' : 'outline-primary'}
          onClick={() => switchMode('to-datetime')}
        >
          Ms → DateTime
        </Button>
      </ButtonGroup>
      <Card className="mb-4">
        <Card.Body>
          {mode === 'to-ms' ? (
            <>
              <Form.Label className="fw-semibold">Date &amp; Time</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => { setDateInput(e.target.value); setEpochResult(null); setError(''); }}
                  isInvalid={dateInput !== '' && !isDateValid}
                  aria-label="DateTime input"
                />
                <Button variant="outline-secondary" onClick={useNow}>Use Now</Button>
                <Button onClick={convert} disabled={!isDateValid}>Convert</Button>
              </InputGroup>
            </>
          ) : (
            <>
              <Form.Label className="fw-semibold">Epoch Milliseconds</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="number"
                  value={msInput}
                  onChange={(e) => { setMsInput(e.target.value); setDateTimeResult(null); setError(''); }}
                  placeholder="e.g. 1715040000000"
                  aria-label="Milliseconds input"
                />
                <Button onClick={convert} disabled={!isMsValid}>Convert</Button>
              </InputGroup>
            </>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>
      </Card>
      {rows && (
        <Card>
          <Card.Header className="fw-semibold">Results</Card.Header>
          <Card.Body className="p-0">
            <Table responsive className="mb-0">
              <tbody>
                {rows.map(({ key, label, value }) => (
                  <ResultRow
                    key={key}
                    label={label}
                    value={value}
                    onCopy={(v) => copyField(key, v)}
                    copied={copiedKey === key}
                  />
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <ToolInfo items={mode === 'to-ms' ? TO_MS_INFO : TO_DATETIME_INFO} />
    </div>
  );
}

export default MillisecondConverter;
