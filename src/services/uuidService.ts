import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

export type UuidVersion = 'v1' | 'v4';

export const generateUuid = (version: UuidVersion): string => {
  switch (version) {
    case 'v1': return uuidv1();
    case 'v4': return uuidv4();
  }
};

export const generateBatch = (version: UuidVersion, count: number): string[] => {
  if (count < 1 || count > 100) throw new RangeError('Count must be between 1 and 100');
  return Array.from({ length: count }, () => generateUuid(version));
};

export const isValidUuid = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};
