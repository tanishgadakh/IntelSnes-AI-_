export default function NotificationsPage() {
  const notifications = [
    { title: 'Analysis completed', detail: 'New review batch analyzed', time: '2 min ago' },
    { title: 'Report generated', detail: 'Monthly satisfaction report is ready', time: '12 min ago' },
    { title: 'System update', detail: 'AI service health remains stable', time: '1 hour ago' }
  ];

  return (
    <div className="notifications-page">
      <div className="hero-card">
        <h2>Notifications</h2>
        <p>Stay informed about analysis updates, reports, and service health.</p>
      </div>
      <div className="panel notification-list">
        {notifications.map((item) => (
          <div key={item.title} className="notification-item">
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
