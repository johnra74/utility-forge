export const encodeUrl = (input: string): string => {
  if (typeof input !== 'string') throw new TypeError('Input must be a string');
  return encodeURIComponent(input);
};

export const decodeUrl = (input: string): string => {
  if (typeof input !== 'string') throw new TypeError('Input must be a string');
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error('Invalid URL-encoded string');
  }
};

export const encodeUrlFull = (url: string): string => {
  if (typeof url !== 'string') throw new TypeError('Input must be a string');
  return encodeURI(url);
};

export const decodeUrlFull = (url: string): string => {
  if (typeof url !== 'string') throw new TypeError('Input must be a string');
  try {
    return decodeURI(url);
  } catch {
    throw new Error('Invalid URL string');
  }
};

export const parseQueryString = (qs: string): Record<string, string> => {
  const clean = qs.startsWith('?') ? qs.slice(1) : qs;
  return Object.fromEntries(new URLSearchParams(clean));
};
