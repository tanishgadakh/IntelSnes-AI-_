import { useState } from 'react';

const notificationSeed = [
  { id: 1, title: 'AI analysis completed', detail: 'Three new reviews were processed and recommended follow-ups are ready.', time: '2 min ago', type: 'success', priority: 'High' },
  { id: 2, title: 'Delivery issue detected', detail: 'Shipping sentiment dropped in the last 24 hours across 18 customer comments.', time: '18 min ago', type: 'warning', priority: 'Medium' },
  { id: 3, title: 'Weekly report generated', detail: 'The satisfaction and churn summary is available for download.', time: '1 hour ago', type: 'info', priority: 'Low' },
  { id: 4, title: 'Model health stable', detail: 'Sentiment and recommendation models are operating within expected thresholds.', time: 'Today', type: 'success', priority: 'Low' }
];

const filters = ['All', 'success', 'warning', 'info'];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const visibleNotifications = activeFilter === 'All'
    ? notificationSeed
    : notificationSeed.filter((item) => item.type === activeFilter);

  return (
    <div className="notifications-page">
      <div className="hero-card">
        <h2>Notifications</h2>
        <p>Stay informed about analysis updates, reports, and service health.</p>
      </div>

      <div className="panel notification-toolbar">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === activeFilter ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="panel notification-list">
        {visibleNotifications.map((item) => (
          <div key={item.id} className="notification-item">
            <div className="notification-header">
              <strong>{item.title}</strong>
              <span className={`notification-badge ${item.type}`}>{item.priority}</span>
            </div>
            <p>{item.detail}</p>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
