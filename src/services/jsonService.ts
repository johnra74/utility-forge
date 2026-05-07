export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export interface JsonStats {
  size: number;
  keys: number;
  depth: number;
}

export const formatJson = (raw: string, indent = 2): string => {
  const parsed: unknown = JSON.parse(raw);
  return JSON.stringify(parsed, null, indent);
};

export const minifyJson = (raw: string): string => {
  const parsed: unknown = JSON.parse(raw);
  return JSON.stringify(parsed);
};

export const validateJson = (raw: string): ValidationResult => {
  try {
    JSON.parse(raw);
    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
};

export const getJsonStats = (raw: string): JsonStats => {
  const parsed: unknown = JSON.parse(raw);
  const str = JSON.stringify(parsed);
  return {
    size: new Blob([str]).size,
    keys: countKeys(parsed),
    depth: getDepth(parsed),
  };
};

const countKeys = (obj: unknown): number => {
  if (typeof obj !== 'object' || obj === null) return 0;
  const values = Object.values(obj as Record<string, unknown>);
  return values.length + values.reduce((acc, v) => acc + countKeys(v), 0);
};

const getDepth = (obj: unknown, depth = 0): number => {
  if (typeof obj !== 'object' || obj === null) return depth;
  const values = Object.values(obj as Record<string, unknown>);
  if (values.length === 0) return depth;
  return Math.max(...values.map((v) => getDepth(v, depth + 1)));
};
