import { useCallback, useEffect, useState } from 'react';
import { normalizeRoute, readRoute, toHash } from '../utils/routes';

export const useHashRoute = () => {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((nextRoute) => {
    const normalized = normalizeRoute(nextRoute);
    if (window.location.hash !== toHash(normalized)) {
      window.location.hash = normalized;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setRoute(normalized);
    }
  }, []);

  return { route, navigate };
};
