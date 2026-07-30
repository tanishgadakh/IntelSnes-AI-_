export default function ProfilePage() {
  return (
    <div className="panel">
      <h2>Profile</h2>
      <p>Manage profile information, sessions, and account preferences.</p>
      <div className="report-grid">
        <div className="metric-card"><p>Name</p><h3>Demo Analyst</h3></div>
        <div className="metric-card"><p>Role</p><h3>Admin</h3></div>
        <div className="metric-card"><p>Sessions</p><h3>2 active</h3></div>
      </div>
    </div>
  );
}
