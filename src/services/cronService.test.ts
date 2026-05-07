import { describe, it, expect } from 'vitest';
import { buildCronExpression, describeCron, validateCronField, CRON_PRESETS } from './cronService';

describe('buildCronExpression', () => {
  it('builds a wildcard expression', () => {
    expect(buildCronExpression({ minute: '*', hour: '*', day: '*', month: '*', weekday: '*' }))
      .toBe('* * * * *');
  });

  it('builds a specific expression', () => {
    expect(buildCronExpression({ minute: '0', hour: '9', day: '1', month: '*', weekday: '*' }))
      .toBe('0 9 1 * *');
  });

  it('builds with step values', () => {
    expect(buildCronExpression({ minute: '*/15', hour: '*', day: '*', month: '*', weekday: '*' }))
      .toBe('*/15 * * * *');
  });
});

describe('describeCron', () => {
  it('describes every minute cron', () => {
    const { description, error } = describeCron('* * * * *');
    expect(error).toBeNull();
    expect(description).toBeTruthy();
    expect(description!.toLowerCase()).toContain('minute');
  });

  it('describes hourly cron', () => {
    const { description } = describeCron('0 * * * *');
    expect(description).toBeTruthy();
  });

  it('returns error for invalid expression', () => {
    const { description, error } = describeCron('invalid');
    expect(description).toBeNull();
    expect(error).toBeTruthy();
  });

  it('describes all preset expressions', () => {
    CRON_PRESETS.forEach(({ value }) => {
      const { description } = describeCron(value);
      expect(description).toBeTruthy();
    });
  });
});

describe('validateCronField', () => {
  it('accepts wildcard *', () => {
    expect(validateCronField('*', 0, 59)).toBe(true);
  });

  it('accepts step */5', () => {
    expect(validateCronField('*/5', 0, 59)).toBe(true);
  });

  it('rejects step */0', () => {
    expect(validateCronField('*/0', 0, 59)).toBe(false);
  });

  it('accepts specific number in range', () => {
    expect(validateCronField('30', 0, 59)).toBe(true);
  });

  it('rejects number out of range', () => {
    expect(validateCronField('60', 0, 59)).toBe(false);
  });

  it('accepts range like 1-5', () => {
    expect(validateCronField('1-5', 0, 59)).toBe(true);
  });

  it('accepts list like 1,2,3', () => {
    expect(validateCronField('1,2,3', 0, 59)).toBe(true);
  });

  it('rejects alphabetic values', () => {
    expect(validateCronField('abc', 0, 59)).toBe(false);
  });
});

describe('CRON_PRESETS', () => {
  it('has at least 5 presets', () => {
    expect(CRON_PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it('each preset has label and valid 5-part value', () => {
    CRON_PRESETS.forEach((preset) => {
      expect(preset.label).toBeTruthy();
      expect(preset.value.split(' ')).toHaveLength(5);
    });
  });
});
