import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, validateJson, getJsonStats } from './jsonService';

describe('formatJson', () => {
  it('formats a flat object with 2-space indent', () => {
    const result = formatJson('{"a":1,"b":2}', 2);
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('formats with 4-space indent', () => {
    const result = formatJson('{"a":1}', 4);
    expect(result).toContain('    "a"');
  });

  it('formats nested objects', () => {
    const result = formatJson('{"a":{"b":1}}', 2);
    expect(result).toContain('"b": 1');
  });

  it('throws for invalid JSON', () => {
    expect(() => formatJson('{invalid}')).toThrow();
  });
});

describe('minifyJson', () => {
  it('removes whitespace', () => {
    const result = minifyJson('{\n  "a": 1\n}');
    expect(result).toBe('{"a":1}');
  });

  it('handles arrays', () => {
    const result = minifyJson('[1, 2, 3]');
    expect(result).toBe('[1,2,3]');
  });

  it('throws for invalid JSON', () => {
    expect(() => minifyJson('not json')).toThrow();
  });
});

describe('validateJson', () => {
  it('returns valid true for valid JSON', () => {
    expect(validateJson('{"a":1}').valid).toBe(true);
    expect(validateJson('{"a":1}').error).toBeNull();
  });

  it('returns valid false for invalid JSON', () => {
    const result = validateJson('{bad}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('validates arrays', () => {
    expect(validateJson('[1,2,3]').valid).toBe(true);
  });

  it('validates primitives', () => {
    expect(validateJson('"hello"').valid).toBe(true);
    expect(validateJson('42').valid).toBe(true);
    expect(validateJson('true').valid).toBe(true);
    expect(validateJson('null').valid).toBe(true);
  });
});

describe('getJsonStats', () => {
  it('counts keys correctly', () => {
    const stats = getJsonStats('{"a":1,"b":2}');
    expect(stats.keys).toBe(2);
  });

  it('counts nested keys', () => {
    const stats = getJsonStats('{"a":{"b":1,"c":2}}');
    expect(stats.keys).toBeGreaterThan(2);
  });

  it('calculates size in bytes', () => {
    const stats = getJsonStats('{"a":1}');
    expect(stats.size).toBeGreaterThan(0);
  });

  it('calculates depth', () => {
    const stats = getJsonStats('{"a":{"b":{"c":1}}}');
    expect(stats.depth).toBeGreaterThanOrEqual(3);
  });

  it('returns depth 0 for empty object', () => {
    const stats = getJsonStats('{}');
    expect(stats.depth).toBe(0);
  });
});
