import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: [ 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER', 'CUSTOMER' ] },
  { to: '/prediction', label: 'AI Workspace', roles: [ 'ADMIN', 'MANAGER', 'ANALYST' ] },
  { to: '/analytics', label: 'Analytics', roles: [ 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER' ] },
  { to: '/history', label: 'Prediction History', roles: [ 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER', 'CUSTOMER' ] },
  { to: '/reports', label: 'Reports', roles: [ 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER', 'CUSTOMER' ] },
  { to: '/assistant', label: 'AI Assistant', roles: [ 'ADMIN', 'MANAGER', 'ANALYST' ] },
  { to: '/notifications', label: 'Notifications', roles: [ 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER', 'CUSTOMER' ] },
  { to: '/admin', label: 'User Management', roles: [ 'ADMIN' ] },
  { to: '/monitoring', label: 'System Monitoring', roles: [ 'ADMIN', 'MANAGER' ] },
  { to: '/model-center', label: 'Model Center', roles: [ 'ADMIN', 'MANAGER', 'ANALYST' ] },
  { to: '/settings', label: 'Settings', roles: [ 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER', 'CUSTOMER' ] },
  { to: '/profile', label: 'Profile', roles: [ 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER', 'CUSTOMER' ] }
];

export default function Layout({ token, role, username, onLogout, theme, onThemeToggle }) {
  const navigate = useNavigate();
  const safeRole = String(role || 'GUEST').toUpperCase();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [welcome, setWelcome] = useState(null);

  const handleLogout = () => {
    // open confirmation modal
    setConfirmOpen(true);
  };

  const doLogout = () => {
    setConfirmOpen(false);
    onLogout();
    navigate('/login');
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('intelsense-welcome');
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (!obj?.ts) return;
      // Show welcome only for a short period (6s)
      if (Date.now() - obj.ts < 6000) {
        setWelcome(obj.username || '');
        setTimeout(() => {
          setWelcome(null);
          try { localStorage.removeItem('intelsense-welcome'); } catch {}
        }, 5000);
      }
    } catch {}
  }, []);

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
          {navItems.filter((item) => item.roles.includes(safeRole)).map((item) => (
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
            <p>{token ? `Signed in as ${username || 'user'}` : 'Authenticate to continue'}</p>
            {welcome && <p className="message">Welcome back, {welcome} 👋</p>}
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={onThemeToggle}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
            <span className="pill">Role: {safeRole}</span>
            <span className="pill">AI Status: Online</span>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
      <ConfirmModal open={confirmOpen} title="Confirm logout" message="Are you sure you want to log out?" onConfirm={doLogout} onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}
