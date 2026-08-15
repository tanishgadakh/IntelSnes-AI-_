import { useEffect, useRef, useCallback } from 'react';
import api from '../api/client';

export const useRealtimeAlerts = (onUpdate, interval = 5000) => {
  const pollIntervalRef = useRef(null);
  const lastFetchRef = useRef(0);

  const fetchAlerts = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) return; // Debounce

    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const resp = await api.get('/api/alerts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      lastFetchRef.current = now;
      onUpdate(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      // Silently fail on network errors
    }
  }, [onUpdate]);

  useEffect(() => {
    // Initial fetch
    fetchAlerts();

    // Set up polling
    pollIntervalRef.current = setInterval(fetchAlerts, interval);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchAlerts, interval]);

  return { refetch: fetchAlerts };
};

export const useRealtimeAnalytics = (onUpdate, interval = 10000) => {
  const pollIntervalRef = useRef(null);
  const lastFetchRef = useRef(0);

  const fetchAnalytics = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) return;

    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const resp = await api.get('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      lastFetchRef.current = now;
      onUpdate(resp?.data?.data || {});
    } catch (error) {
      // Silently fail on network errors
    }
  }, [onUpdate]);

  useEffect(() => {
    // Initial fetch
    fetchAnalytics();

    // Set up polling
    pollIntervalRef.current = setInterval(fetchAnalytics, interval);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchAnalytics, interval]);

  return { refetch: fetchAnalytics };
};
