import { useMemo } from 'react';
import { parseJwt } from '../utils/jwt';

export default function useAuthRole(token) {
  return useMemo(() => {
    if (!token) return 'Guest';
    return parseJwt(token)?.role || 'Guest';
  }, [token]);
}
