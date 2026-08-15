import { useEffect } from 'react';

export const usePerformanceMonitoring = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;

    performance.mark(startMark);

    return () => {
      performance.mark(endMark);
      try {
        performance.measure(componentName, startMark, endMark);
        const measure = performance.getEntriesByName(componentName)[0];
        if (measure.duration > 100) {
          console.warn(`⚠️ [Performance] ${componentName} took ${measure.duration.toFixed(2)}ms`);
        }
      } catch (e) {
        // Silently fail if not supported
      }
    };
  }, [componentName]);
};

export const logPageMetrics = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 500) {
            console.info(`📊 [Metrics] ${entry.name}: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // Silently fail if not supported
    }
  }
};
