import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useRealtimeAlerts } from '../hooks/useRealtimePolling';
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring';
import { SkeletonTable } from '../components/LoadingSkeleton';

const filters = ['All', 'info', 'warning', 'critical'];

const isAlertLevel = (value) => ['info', 'warning', 'critical'].includes(String(value || '').toLowerCase());

function formatTimestamp(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function NotificationsPage() {
  usePerformanceMonitoring('NotificationsPage');
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Real-time alert polling (5-second interval)
  const { refetch } = useRealtimeAlerts(
    (alerts) => {
      const list = Array.isArray(alerts) ? alerts : [];
      setNotifications(list.map((item) => {
        const level = String(item.level || 'info').toLowerCase();
        const payload = item.payload && typeof item.payload === 'object' ? item.payload : {};
        return {
          id: item.id || `${level}-${item.created_at || Date.now()}`,
          title: String(item.message || 'System alert').trim() || 'System alert',
          detail: payload.summary || payload.message || payload.source || 'No additional context available.',
          time: formatTimestamp(item.created_at),
          type: isAlertLevel(level) ? level : 'info',
          priority: level === 'critical' ? 'High' : level === 'warning' ? 'Medium' : 'Low',
        };
      }));
      setLoading(false);
    },
    5000 // Poll every 5 seconds for new alerts
  );

  const visibleNotifications = useMemo(() => {
    if (activeFilter === 'All') return notifications;
    return notifications.filter((item) => item.type === activeFilter.toLowerCase());
  }, [activeFilter, notifications]);

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="hero-card">
          <h2>Notifications</h2>
          <p>Real-time alerts and updates</p>
        </div>
        <SkeletonTable rows={4} cols={3} />
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="hero-card">
        <h2>Notifications</h2>
        <p>Stay informed about analysis updates, reports, and service health. Updates every 5 seconds.</p>
      </div>

      <div className="panel notification-toolbar" role="tablist" aria-label="Notification filters">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === activeFilter ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setActiveFilter(filter)}
            role="tab"
            aria-selected={filter === activeFilter}
            aria-label={`Filter by ${filter.toLowerCase()}`}
          >
            {filter}
          </button>
        ))}
        <button
          className="ghost-btn"
          onClick={() => refetch()}
          style={{ marginLeft: 'auto' }}
          aria-label="Refresh notifications"
          title="Manually refresh alerts"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="panel notification-list" role="region" aria-label="Notifications list" aria-live="polite">
        {visibleNotifications.length === 0 ? (
          <p className="muted">No notifications available for this filter.</p>
        ) : (
          <div className="notifications-stack">
            {visibleNotifications.map((item, idx) => (
              <div
                key={item.id}
                className={`notification-item notification-${item.type}`}
                role="article"
                aria-label={`${item.title} - ${item.priority} priority`}
              >
                <div className="notification-header">
                  <strong>{item.title}</strong>
                  <span className={`notification-badge ${item.type}`} role="status">
                    {item.priority}
                  </span>
                </div>
                <p>{item.detail}</p>
                <span className="notification-time" aria-label={`Posted ${item.time}`}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="notification-footer" style={{ marginTop: '20px', fontSize: '0.85rem', color: '#666' }}>
          ✓ Showing {visibleNotifications.length} of {notifications.length} notifications
        </p>
      </div>
    </div>
  );
}
