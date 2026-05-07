import { useState, useCallback } from 'react';

interface ClipboardHook {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

function useClipboard(timeout = 2000): ClipboardHook {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch {
      return false;
    }
  }, [timeout]);

  return { copied, copy };
}

export default useClipboard;
