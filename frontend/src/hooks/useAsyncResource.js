import { useCallback, useEffect, useRef, useState } from 'react';

export const useAsyncResource = (loader, dependencies = [], options = {}) => {
  const { immediate = true, normalize = (value) => value } = options;
  const [state, setState] = useState({ data: null, status: immediate ? 'loading' : 'idle', error: null, lastUpdated: null });
  const requestRef = useRef(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const run = useCallback(async () => {
    const requestId = ++requestRef.current;
    setState((previous) => ({
      ...previous,
      status: previous.data ? 'loading' : 'loading',
      error: null,
    }));

    try {
      const response = await loaderRef.current();
      if (requestId !== requestRef.current) return response;
      setState({ data: normalize(response), status: 'ready', error: null, lastUpdated: new Date().toISOString() });
      return response;
    } catch (error) {
      if (requestId !== requestRef.current) return null;
      setState((previous) => ({
        ...previous,
        status: previous.data ? 'stale' : 'error',
        error,
      }));
      return null;
    }
  }, [normalize]);

  useEffect(() => {
    if (immediate) run();
    return () => { requestRef.current += 1; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ...state, retry: run };
};
