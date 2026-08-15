import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import api from '../api/client';
import { SkeletonTable } from './LoadingSkeleton';
import './NotificationsPanel.css';

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, critical

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = [
          {
            id: 1,
            type: 'critical',
            title: 'System Alert',
            message: 'Model accuracy dropped below 90%',
            timestamp: new Date(Date.now() - 5 * 60000),
            read: false,
            icon: AlertTriangle,
          },
          {
            id: 2,
            type: 'warning',
            title: 'High Volume Alert',
            message: 'Processing queue is at 85% capacity',
            timestamp: new Date(Date.now() - 15 * 60000),
            read: false,
            icon: AlertCircle,
          },
          {
            id: 3,
            type: 'info',
            title: 'New Report Available',
            message: 'Monthly analytics report has been generated',
            timestamp: new Date(Date.now() - 1 * 60 * 60000),
            read: true,
            icon: Info,
          },
          {
            id: 4,
            type: 'success',
            title: 'Task Completed',
            message: 'Batch prediction processing completed successfully',
            timestamp: new Date(Date.now() - 2 * 60 * 60000),
            read: true,
            icon: CheckCircle,
          },
          {
            id: 5,
            type: 'warning',
            title: 'API Rate Limit',
            message: 'Approaching monthly API rate limit',
            timestamp: new Date(Date.now() - 3 * 60 * 60000),
            read: true,
            icon: AlertCircle,
          },
        ];
        setNotifications(mockData);
      } catch (error) {
        console.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.type === 'critical';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const handleDismiss = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  if (loading) return <SkeletonTable rows={5} cols={3} />;

  return (
    <div className="notifications-panel">
      <div className="panel-header">
        <div className="header-title">
          <Bell size={20} />
          <h2>Notifications</h2>
          {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="filter-tabs">
        {['all', 'unread', 'critical'].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const IconComponent = notif.icon;
            return (
              <div
                key={notif.id}
                className={`notification-item notification-${notif.type} ${notif.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  <IconComponent size={20} />
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notif.title}</h3>
                    <span className="notification-time">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  <p>{notif.message}</p>
                  {!notif.read && (
                    <div className="notification-actions">
                      <button
                        className="btn-action"
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
                <button
                  className="btn-dismiss"
                  onClick={() => handleDismiss(notif.id)}
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            {filter === 'unread' ? 'All notifications read' : 'No notifications'}
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="panel-footer">
          <span className="footer-info">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </span>
        </div>
      )}
    </div>
  );
}

function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
