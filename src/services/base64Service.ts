export const encodeText = (text: string): string => {
  if (typeof text !== 'string') throw new TypeError('Input must be a string');
  return btoa(unescape(encodeURIComponent(text)));
};

export const decodeText = (b64: string): string => {
  if (typeof b64 !== 'string') throw new TypeError('Input must be a string');
  try {
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    throw new Error('Invalid Base64 string');
  }
};

export const encodeFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

export const isValidBase64 = (str: unknown): boolean => {
  if (typeof str !== 'string' || str.length === 0) return false;
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  const stripped = str.replace(/\s/g, '');
  return base64Regex.test(stripped) && stripped.length % 4 === 0;
};

export const getDataUrlMimeType = (dataUrl: string): string | null => {
  const match = dataUrl.match(/^data:([^;]+);base64,/);
  return match ? match[1] : null;
};
