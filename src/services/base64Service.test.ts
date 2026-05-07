import { describe, it, expect } from 'vitest';
import {
  encodeText,
  decodeText,
  isValidBase64,
  getDataUrlMimeType,
} from './base64Service';

describe('encodeText', () => {
  it('encodes plain ASCII text', () => {
    expect(encodeText('hello')).toBe('aGVsbG8=');
  });

  it('encodes empty string', () => {
    expect(encodeText('')).toBe('');
  });

  it('encodes UTF-8 characters', () => {
    const result = encodeText('héllo');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('throws for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(() => encodeText(123)).toThrow(TypeError);
  });
});

describe('decodeText', () => {
  it('decodes valid base64', () => {
    expect(decodeText('aGVsbG8=')).toBe('hello');
  });

  it('decodes empty string', () => {
    expect(decodeText('')).toBe('');
  });

  it('round-trips encode/decode', () => {
    const original = 'Hello, World! 123';
    expect(decodeText(encodeText(original))).toBe(original);
  });

  it('throws for invalid base64', () => {
    expect(() => decodeText('!!!invalid!!!')).toThrow();
  });

  it('throws for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(() => decodeText(null)).toThrow(TypeError);
  });
});

describe('isValidBase64', () => {
  it('returns true for valid base64', () => {
    expect(isValidBase64('aGVsbG8=')).toBe(true);
  });

  it('returns false for base64 without correct padding', () => {
    expect(isValidBase64('aGVsbG8')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidBase64('')).toBe(false);
  });

  it('returns false for non-string', () => {
    expect(isValidBase64(null)).toBe(false);
  });

  it('returns false for strings with special characters', () => {
    expect(isValidBase64('hello world!')).toBe(false);
  });

  it('returns true for a long valid base64 string', () => {
    const encoded = btoa('This is a longer test string for base64');
    expect(isValidBase64(encoded)).toBe(true);
  });
});

describe('getDataUrlMimeType', () => {
  it('extracts mime type from data URL', () => {
    expect(getDataUrlMimeType('data:image/png;base64,abc')).toBe('image/png');
  });

  it('returns null for non-data URL', () => {
    expect(getDataUrlMimeType('https://example.com')).toBeNull();
  });

  it('handles audio mime type', () => {
    expect(getDataUrlMimeType('data:audio/mp3;base64,xyz')).toBe('audio/mp3');
  });

  it('handles video mime type', () => {
    expect(getDataUrlMimeType('data:video/mp4;base64,xyz')).toBe('video/mp4');
  });
});
