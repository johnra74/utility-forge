import cronstrue from 'cronstrue';

export interface CronFields {
  minute: string;
  hour: string;
  day: string;
  month: string;
  weekday: string;
}

export interface CronDescription {
  description: string | null;
  error: string | null;
}

export interface CronPreset {
  label: string;
  value: string;
}

export const buildCronExpression = ({ minute, hour, day, month, weekday }: CronFields): string =>
  `${minute} ${hour} ${day} ${month} ${weekday}`;

export const describeCron = (expression: string): CronDescription => {
  try {
    return { description: cronstrue.toString(expression), error: null };
  } catch (e) {
    return { description: null, error: (e as Error).message || 'Invalid cron expression' };
  }
};

export const validateCronField = (value: string, min: number, max: number): boolean => {
  if (value === '*') return true;
  if (/^\*\/\d+$/.test(value)) {
    const step = parseInt(value.split('/')[1], 10);
    return step >= 1 && step <= max;
  }
  if (/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(value)) {
    const nums = value.split(',').flatMap((p) => p.split('-').map(Number));
    return nums.every((n) => n >= min && n <= max);
  }
  return false;
};

export const CRON_PRESETS: CronPreset[] = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every Monday', value: '0 0 * * 1' },
  { label: 'Every month (1st)', value: '0 0 1 * *' },
  { label: 'Every weekday', value: '0 9 * * 1-5' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Twice a day', value: '0 9,17 * * *' },
];
