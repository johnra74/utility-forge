import { describe, it, expect } from 'vitest';
import { encodeUrl, decodeUrl, encodeUrlFull, decodeUrlFull, parseQueryString } from './urlService';

describe('encodeUrl', () => {
  it('encodes spaces as %20', () => {
    expect(encodeUrl('hello world')).toBe('hello%20world');
  });

  it('encodes special characters', () => {
    expect(encodeUrl('foo=bar&baz=qux')).toBe('foo%3Dbar%26baz%3Dqux');
  });

  it('leaves alphanumerics unchanged', () => {
    expect(encodeUrl('hello123')).toBe('hello123');
  });

  it('throws for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(() => encodeUrl(42)).toThrow(TypeError);
  });
});

describe('decodeUrl', () => {
  it('decodes %20 as space', () => {
    expect(decodeUrl('hello%20world')).toBe('hello world');
  });

  it('decodes encoded special characters', () => {
    expect(decodeUrl('foo%3Dbar')).toBe('foo=bar');
  });

  it('round-trips encode/decode', () => {
    const original = 'foo=bar&hello world/path';
    expect(decodeUrl(encodeUrl(original))).toBe(original);
  });

  it('throws for invalid encoding', () => {
    expect(() => decodeUrl('%GG')).toThrow();
  });

  it('throws for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(() => decodeUrl(null)).toThrow(TypeError);
  });
});

describe('encodeUrlFull', () => {
  it('preserves protocol slashes', () => {
    const result = encodeUrlFull('https://example.com/path with spaces');
    expect(result).toContain('https://');
    expect(result).toContain('%20');
  });

  it('throws for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(() => encodeUrlFull(123)).toThrow(TypeError);
  });
});

describe('decodeUrlFull', () => {
  it('decodes encoded URL', () => {
    const result = decodeUrlFull('https://example.com/path%20with%20spaces');
    expect(result).toBe('https://example.com/path with spaces');
  });

  it('throws for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(() => decodeUrlFull({})).toThrow(TypeError);
  });
});

describe('parseQueryString', () => {
  it('parses a simple query string', () => {
    const result = parseQueryString('?name=John&age=30');
    expect(result.name).toBe('John');
    expect(result.age).toBe('30');
  });

  it('works without leading ?', () => {
    const result = parseQueryString('name=John&city=NYC');
    expect(result.name).toBe('John');
    expect(result.city).toBe('NYC');
  });

  it('decodes URL-encoded values', () => {
    const result = parseQueryString('q=hello%20world');
    expect(result.q).toBe('hello world');
  });

  it('returns empty object for empty string', () => {
    const result = parseQueryString('');
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('handles + as space', () => {
    const result = parseQueryString('name=John+Doe');
    expect(result.name).toBe('John Doe');
  });
});
