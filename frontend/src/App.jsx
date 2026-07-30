import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { parseJwt } from './utils/jwt';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
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

function ProtectedRoute({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ token, allowedRoles, children }) {
  if (!token) return <Navigate to="/login" replace />;
  const payload = parseJwt(token);
  const role = payload?.role;
  return allowedRoles.includes(role)
    ? children
    : <Navigate to="/access-denied" state={{ requiredRoles: allowedRoles }} replace />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('intelsense-token') || '');
  const [theme, setTheme] = useState(localStorage.getItem('intelsense-theme') || 'dark');
  const [role, setRole] = useState(() => {
    const existingToken = localStorage.getItem('intelsense-token');
    return parseJwt(existingToken)?.role || '';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('intelsense-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('intelsense-token', token);
      setRole(parseJwt(token)?.role || '');
    } else {
      localStorage.removeItem('intelsense-token');
      setRole('');
    }
  }, [token]);

  const handleLogout = () => setToken('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={setToken} />} />
        <Route path="/register" element={<RegisterPage onLogin={setToken} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<Layout token={token} role={role} onLogout={handleLogout} theme={theme} onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}>
          <Route path="/dashboard" element={<ProtectedRoute token={token}><DashboardPage /></ProtectedRoute>} />
          <Route path="/prediction" element={<RoleRoute token={token} allowedRoles={[ 'ADMIN', 'MANAGER', 'ANALYST' ]}><PredictionPage token={token} /></RoleRoute>} />
          <Route path="/analytics" element={<ProtectedRoute token={token}><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute token={token}><HistoryPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute token={token}><ReportsPage /></ProtectedRoute>} />
          <Route path="/assistant" element={<RoleRoute token={token} allowedRoles={[ 'ADMIN', 'MANAGER', 'ANALYST' ]}><AssistantPage /></RoleRoute>} />
          <Route path="/notifications" element={<ProtectedRoute token={token}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<RoleRoute token={token} allowedRoles={[ 'ADMIN' ]}><AdminPage /></RoleRoute>} />
          <Route path="/monitoring" element={<RoleRoute token={token} allowedRoles={[ 'ADMIN', 'MANAGER' ]}><MonitoringPage /></RoleRoute>} />
          <Route path="/model-center" element={<RoleRoute token={token} allowedRoles={[ 'ADMIN', 'MANAGER', 'ANALYST' ]}><ModelCenterPage /></RoleRoute>} />
          <Route path="/settings" element={<ProtectedRoute token={token}><SettingsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute token={token}><ProfilePage /></ProtectedRoute>} />
        </Route>
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
