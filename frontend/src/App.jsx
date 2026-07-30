import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('intelsense-token') || '');
  const [theme, setTheme] = useState(localStorage.getItem('intelsense-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('intelsense-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('intelsense-token', token);
    } else {
      localStorage.removeItem('intelsense-token');
    }
  }, [token]);

  const handleLogout = () => setToken('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={setToken} />} />
        <Route path="/register" element={<RegisterPage onLogin={setToken} />} />
        <Route element={<Layout token={token} onLogout={handleLogout} theme={theme} onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}>
          <Route path="/dashboard" element={<ProtectedRoute token={token}><DashboardPage /></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute token={token}><PredictionPage token={token} /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute token={token}><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute token={token}><HistoryPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute token={token}><ReportsPage /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute token={token}><AssistantPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute token={token}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute token={token}><AdminPage /></ProtectedRoute>} />
          <Route path="/monitoring" element={<ProtectedRoute token={token}><MonitoringPage /></ProtectedRoute>} />
          <Route path="/model-center" element={<ProtectedRoute token={token}><ModelCenterPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute token={token}><SettingsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute token={token}><ProfilePage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
