import { useEffect, useRef, useState } from 'react';

/**
 * useLocalStorage — keep a piece of state in sync with localStorage.
 *
 * Returns [value, setValue, error] where `error` is the most recent write
 * error (e.g. QuotaExceededError) or null if the last write succeeded.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch (err) {
      console.warn('useLocalStorage read error', err);
      return initialValue;
    }
  });

  const [error, setError] = useState(null);
  const isFirstWrite = useRef(true);

  useEffect(() => {
    // Skip the very first write — initialValue is already persisted in
    // the lazy initializer above, so re-writing here would be redundant.
    if (isFirstWrite.current) {
      isFirstWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setError(null);
    } catch (err) {
      console.warn('useLocalStorage write error', err);
      setError(err);
    }
  }, [key, value]);

  return [value, setValue, error];
}

/** Try to write a value to localStorage right now and return success/error. */
export function tryWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err };
  }
}
