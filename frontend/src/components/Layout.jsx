import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/prediction', label: 'AI Workspace' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/history', label: 'Prediction History' },
  { to: '/reports', label: 'Reports' },
  { to: '/assistant', label: 'AI Assistant' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/admin', label: 'User Management' },
  { to: '/monitoring', label: 'System Monitoring' },
  { to: '/model-center', label: 'Model Center' },
  { to: '/settings', label: 'Settings' },
  { to: '/profile', label: 'Profile' }
];

export default function Layout({ token, onLogout, theme, onThemeToggle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h2>IntelSense</h2>
            <p>AI Platform</p>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div>
            <h3>Enterprise Intelligence Workspace</h3>
            <p>{token ? 'Connected to backend' : 'Authenticate to continue'}</p>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={onThemeToggle}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
            <span className="pill">AI Status: Online</span>
            <span className="pill">Secure</span>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
