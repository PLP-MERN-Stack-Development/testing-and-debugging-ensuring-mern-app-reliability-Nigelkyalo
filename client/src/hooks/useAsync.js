import { useCallback, useRef, useState } from 'react';

export function useAsync(asyncFunction, { immediate = true } = {}) {
  const [status, setStatus] = useState(immediate ? 'pending' : 'idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(
    async (...args) => {
      setStatus('pending');
      setValue(null);
      setError(null);
      try {
        const response = await asyncFunction(...args);
        if (!mountedRef.current) {
          return response;
        }
        setValue(response);
        setStatus('success');
        return response;
      } catch (err) {
        if (!mountedRef.current) {
          throw err;
        }
        setError(err);
        setStatus('error');
        throw err;
      }
    },
    [asyncFunction]
  );

  const cancel = () => {
    mountedRef.current = false;
  };

  return {
    execute,
    status,
    value,
    error,
    cancel
  };
}

export default useAsync;

