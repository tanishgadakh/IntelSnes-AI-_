export default function ProfilePage({ user }) {
  return (
    <div className="panel">
      <h2>Profile</h2>
      <p>Manage profile information, sessions, and account preferences.</p>
      <div className="report-grid">
        <div className="metric-card"><p>Name</p><h3>{user?.username || 'Guest User'}</h3></div>
        <div className="metric-card"><p>Role</p><h3>{user?.role || 'GUEST'}</h3></div>
        <div className="metric-card"><p>Session</p><h3>{user?.token ? 'Authenticated' : 'Not signed in'}</h3></div>
      </div>
    </div>
  );
}
