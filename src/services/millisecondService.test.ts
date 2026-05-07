import { describe, it, expect } from 'vitest';
import { convertDateTimeToMs, convertMsToDateTime, nowAsDateTimeLocal, isValidDateTimeString, isValidMillisecondInput } from './millisecondService';

describe('convertDateTimeToMs', () => {
  it('converts the Unix epoch string to 0 ms', () => {
    const result = convertDateTimeToMs('1970-01-01T00:00:00.000Z');
    expect(result.milliseconds).toBe(0);
    expect(result.unix).toBe(0);
  });

  it('returns utcIso ending in Z', () => {
    const result = convertDateTimeToMs('2024-05-06T00:00:00.000Z');
    expect(result.utcIso).toMatch(/Z$/);
  });

  it('returns a non-empty utc string', () => {
    const result = convertDateTimeToMs('2024-05-06T00:00:00.000Z');
    expect(result.utc).toBeTruthy();
  });

  it('calculates unix seconds as milliseconds / 1000 floored', () => {
    const result = convertDateTimeToMs('1970-01-01T00:00:05.999Z');
    expect(result.unix).toBe(5);
  });

  it('handles ISO 8601 strings with timezone offset', () => {
    const result = convertDateTimeToMs('2024-01-01T00:00:00+00:00');
    expect(result.milliseconds).toBeGreaterThanOrEqual(0);
  });

  it('throws for an empty string', () => {
    expect(() => convertDateTimeToMs('')).toThrow('Date/time string is required');
  });

  it('throws for a nonsense string', () => {
    expect(() => convertDateTimeToMs('not a date')).toThrow('Invalid date/time value');
  });

  it('milliseconds and unix are consistent', () => {
    const result = convertDateTimeToMs('2024-05-06T00:00:00.000Z');
    expect(result.unix).toBe(Math.floor(result.milliseconds / 1000));
  });
});

describe('nowAsDateTimeLocal', () => {
  it('returns a non-empty string', () => {
    expect(nowAsDateTimeLocal()).toBeTruthy();
  });

  it('matches the datetime-local input format YYYY-MM-DDTHH:mm', () => {
    expect(nowAsDateTimeLocal()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('is parseable as a date', () => {
    const val = nowAsDateTimeLocal();
    expect(isNaN(new Date(val).getTime())).toBe(false);
  });
});

describe('convertMsToDateTime', () => {
  it('converts 0 ms to the Unix epoch', () => {
    const result = convertMsToDateTime('0');
    expect(result.utcIso).toBe('1970-01-01T00:00:00.000Z');
  });

  it('returns utcIso ending in Z', () => {
    const result = convertMsToDateTime('1715040000000');
    expect(result.utcIso).toMatch(/Z$/);
  });

  it('returns a non-empty utc string', () => {
    const result = convertMsToDateTime('1715040000000');
    expect(result.utc).toBeTruthy();
  });

  it('returns a non-empty local string', () => {
    const result = convertMsToDateTime('1715040000000');
    expect(result.local).toBeTruthy();
  });

  it('returns dateTimeLocal in YYYY-MM-DDTHH:mm format', () => {
    const result = convertMsToDateTime('1715040000000');
    expect(result.dateTimeLocal).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('handles negative ms (before Unix epoch)', () => {
    const result = convertMsToDateTime('-1000');
    expect(result.utcIso).toBe('1969-12-31T23:59:59.000Z');
  });

  it('throws for an empty string', () => {
    expect(() => convertMsToDateTime('')).toThrow('Invalid millisecond value');
  });

  it('throws for a non-numeric string', () => {
    expect(() => convertMsToDateTime('not a number')).toThrow('Invalid millisecond value');
  });
});

describe('isValidMillisecondInput', () => {
  it('returns true for a valid integer string', () => {
    expect(isValidMillisecondInput('1715040000000')).toBe(true);
  });

  it('returns true for zero', () => {
    expect(isValidMillisecondInput('0')).toBe(true);
  });

  it('returns true for a negative number', () => {
    expect(isValidMillisecondInput('-1000')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isValidMillisecondInput('')).toBe(false);
  });

  it('returns false for a whitespace-only string', () => {
    expect(isValidMillisecondInput('   ')).toBe(false);
  });

  it('returns false for a non-numeric string', () => {
    expect(isValidMillisecondInput('abc')).toBe(false);
  });
});

describe('isValidDateTimeString', () => {
  it('returns true for a valid ISO string', () => {
    expect(isValidDateTimeString('2024-05-06T00:00:00.000Z')).toBe(true);
  });

  it('returns true for a datetime-local format value', () => {
    expect(isValidDateTimeString('2024-05-06T12:30')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidDateTimeString('')).toBe(false);
  });

  it('returns false for a nonsense string', () => {
    expect(isValidDateTimeString('not a date')).toBe(false);
  });

  it('returns true for a date-only string', () => {
    expect(isValidDateTimeString('2024-05-06')).toBe(true);
  });
});
