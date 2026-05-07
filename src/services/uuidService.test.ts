import { describe, it, expect } from 'vitest';
import { generateUuid, generateBatch, isValidUuid } from './uuidService';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('generateUuid', () => {
  it('generates a valid v1 UUID', () => {
    const uuid = generateUuid('v1');
    expect(uuid).toMatch(UUID_REGEX);
    expect(uuid[14]).toBe('1');
  });

  it('generates a valid v4 UUID', () => {
    const uuid = generateUuid('v4');
    expect(uuid).toMatch(UUID_REGEX);
    expect(uuid[14]).toBe('4');
  });

  it('generates unique UUIDs each call', () => {
    const a = generateUuid('v4');
    const b = generateUuid('v4');
    expect(a).not.toBe(b);
  });
});

describe('generateBatch', () => {
  it('generates the requested count of UUIDs', () => {
    const batch = generateBatch('v4', 10);
    expect(batch).toHaveLength(10);
  });

  it('generates 1 UUID for count=1', () => {
    const batch = generateBatch('v1', 1);
    expect(batch).toHaveLength(1);
    expect(batch[0]).toMatch(UUID_REGEX);
  });

  it('generates 100 UUIDs for count=100', () => {
    const batch = generateBatch('v4', 100);
    expect(batch).toHaveLength(100);
  });

  it('throws for count < 1', () => {
    expect(() => generateBatch('v4', 0)).toThrow(RangeError);
  });

  it('throws for count > 100', () => {
    expect(() => generateBatch('v4', 101)).toThrow(RangeError);
  });

  it('all generated UUIDs are unique', () => {
    const batch = generateBatch('v4', 20);
    const unique = new Set(batch);
    expect(unique.size).toBe(20);
  });
});

describe('isValidUuid', () => {
  it('returns true for a valid UUID', () => {
    expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('returns false for an invalid UUID', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidUuid('')).toBe(false);
  });

  it('validates v1 UUIDs', () => {
    const v1 = generateUuid('v1');
    expect(isValidUuid(v1)).toBe(true);
  });

  it('validates v4 UUIDs', () => {
    const v4 = generateUuid('v4');
    expect(isValidUuid(v4)).toBe(true);
  });

  it('returns false for UUID with wrong variant byte', () => {
    expect(isValidUuid('550e8400-e29b-91d4-a716-446655440000')).toBe(false);
  });
});
