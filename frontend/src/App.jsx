import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { parseJwt } from './utils/jwt';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import AssistantPage from './pages/AssistantPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import MonitoringPage from './pages/MonitoringPage';
import ModelCenterPage from './pages/ModelCenterPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function normalizeRole(role) {
  return String(role || '').toUpperCase();
}

function getDashboardPath(role) {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'ANALYST':
      return '/analyst/dashboard';
    case 'CUSTOMER':
      return '/customer/dashboard';
    default:
      return '/dashboard';
  }
}

function ProtectedRoute({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ token, allowedRoles, children }) {
  if (!token) return <Navigate to="/login" replace />;
  const payload = parseJwt(token);
  const role = normalizeRole(payload?.role || '');
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
  return normalizedAllowedRoles.includes(role)
    ? children
    : <Navigate to="/access-denied" state={{ requiredRoles: normalizedAllowedRoles }} replace />;
}

export default function App() {
  const [auth, setAuth] = useState(() => {
    const storedToken = localStorage.getItem('intelsense-token') || '';
    const storedRole = localStorage.getItem('intelsense-role') || '';
    const storedUsername = localStorage.getItem('intelsense-username') || '';

    return {
      token: storedToken,
      role: normalizeRole(storedRole || parseJwt(storedToken)?.role || ''),
      username: storedUsername
    };
  });
  const [theme, setTheme] = useState(localStorage.getItem('intelsense-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('intelsense-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('intelsense-token', auth.token);
      localStorage.setItem('intelsense-role', auth.role || '');
      localStorage.setItem('intelsense-username', auth.username || '');
    } else {
      localStorage.removeItem('intelsense-token');
      localStorage.removeItem('intelsense-role');
      localStorage.removeItem('intelsense-username');
    }
  }, [auth]);

  const handleLogin = ({ token, role, username }) => {
    setAuth({ token, role: normalizeRole(role), username });
  };

  const handleLogout = () => {
    setAuth({ token: '', role: '', username: '' });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<Layout token={auth.token} role={auth.role} username={auth.username} onLogout={handleLogout} theme={theme} onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}>
          <Route path="/dashboard" element={<ProtectedRoute token={auth.token}><DashboardPage user={auth} /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<RoleRoute token={auth.token} allowedRoles={[ 'ADMIN' ]}><DashboardPage user={auth} /></RoleRoute>} />
          <Route path="/analyst/dashboard" element={<RoleRoute token={auth.token} allowedRoles={[ 'ANALYST' ]}><DashboardPage user={auth} /></RoleRoute>} />
          <Route path="/customer/dashboard" element={<RoleRoute token={auth.token} allowedRoles={[ 'CUSTOMER' ]}><DashboardPage user={auth} /></RoleRoute>} />
          <Route path="/prediction" element={<RoleRoute token={auth.token} allowedRoles={[ 'ADMIN', 'MANAGER', 'ANALYST' ]}><PredictionPage token={auth.token} /></RoleRoute>} />
          <Route path="/analytics" element={<ProtectedRoute token={auth.token}><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute token={auth.token}><HistoryPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute token={auth.token}><ReportsPage /></ProtectedRoute>} />
          <Route path="/assistant" element={<RoleRoute token={auth.token} allowedRoles={[ 'ADMIN', 'MANAGER', 'ANALYST' ]}><AssistantPage token={auth.token} /></RoleRoute>} />
          <Route path="/notifications" element={<ProtectedRoute token={auth.token}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<RoleRoute token={auth.token} allowedRoles={[ 'ADMIN' ]}><AdminPage /></RoleRoute>} />
          <Route path="/monitoring" element={<RoleRoute token={auth.token} allowedRoles={[ 'ADMIN', 'MANAGER' ]}><MonitoringPage /></RoleRoute>} />
          <Route path="/model-center" element={<RoleRoute token={auth.token} allowedRoles={[ 'ADMIN', 'MANAGER', 'ANALYST' ]}><ModelCenterPage /></RoleRoute>} />
          <Route path="/settings" element={<ProtectedRoute token={auth.token}><SettingsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute token={auth.token}><ProfilePage user={auth} /></ProtectedRoute>} />
        </Route>
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
