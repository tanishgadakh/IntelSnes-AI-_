import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal';

const navItems = {
  CUSTOMER: [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/ai-studio', label: '🤖 AI Studio' },
    { to: '/prediction', label: '🧠 AI Workspace' },
    { to: '/analytics', label: '📊 Analytics' },
    { to: '/reports', label: '📄 Reports' },
    { to: '/notifications', label: '🔔 Notifications' },
    { to: '/profile', label: '👤 Profile' },
    { to: '/settings', label: '⚙️ Settings' }
  ],
  ANALYST: [
    { to: '/analyst/dashboard', label: '🏠 Dashboard' },
    { to: '/prediction', label: '🧠 AI Workspace' },
    { to: '/analyst/analysis', label: '🤖 Analysis' },
    { to: '/analyst/trends', label: '📈 Trends' },
    { to: '/analyst/review-queue', label: '📋 Review Queue' },
    { to: '/analytics', label: '📊 Analytics' },
    { to: '/reports', label: '📄 Reports' },
    { to: '/notifications', label: '🔔 Notifications' }
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: '🏠 Dashboard' },
    { to: '/prediction', label: '🧠 AI Workspace' },
    { to: '/admin/users', label: '👥 Users' },
    { to: '/admin/analytics', label: '📊 Platform Analytics' },
    { to: '/admin/ai', label: '🤖 AI Service' },
    { to: '/admin/reports', label: '📈 Reports' },
    { to: '/admin/security', label: '🔒 Security' },
    { to: '/notifications', label: '🔔 Notifications' }
  ],
  DEFAULT: [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/prediction', label: '🧠 AI Workspace' },
    { to: '/notifications', label: '🔔 Notifications' }
  ]
};

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
          {(navItems[safeRole] || navItems.DEFAULT).map((item) => (
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
