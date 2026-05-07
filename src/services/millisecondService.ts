export interface EpochResult {
  milliseconds: number;
  unix: number;
  utcIso: string;
  utc: string;
}

export interface DateTimeResult {
  utcIso: string;
  utc: string;
  local: string;
  dateTimeLocal: string;
}

export const convertDateTimeToMs = (dateStr: string): EpochResult => {
  if (!dateStr) throw new Error('Date/time string is required');
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error('Invalid date/time value');
  const ms = date.getTime();
  return {
    milliseconds: ms,
    unix: Math.floor(ms / 1000),
    utcIso: date.toISOString(),
    utc: date.toUTCString(),
  };
};

export const nowAsDateTimeLocal = (): string => {
  const now = new Date();
  const localMs = now.getTime() - now.getTimezoneOffset() * 60000;
  return new Date(localMs).toISOString().slice(0, 16);
};

export const isValidDateTimeString = (str: string): boolean => {
  if (!str) return false;
  return !isNaN(new Date(str).getTime());
};

export const convertMsToDateTime = (msStr: string): DateTimeResult => {
  const ms = Number(msStr);
  if (!msStr.trim() || isNaN(ms)) throw new Error('Invalid millisecond value');
  const date = new Date(ms);
  const localMs = date.getTime() - date.getTimezoneOffset() * 60000;
  return {
    utcIso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    dateTimeLocal: new Date(localMs).toISOString().slice(0, 16),
  };
};

export const isValidMillisecondInput = (str: string): boolean => {
  if (!str.trim()) return false;
  return !isNaN(Number(str));
};
