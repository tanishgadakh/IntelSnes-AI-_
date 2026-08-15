import { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { parseJwt } from './utils/jwt';
import Layout from './components/Layout';
import { DarkModeProvider } from './components/DarkMode';
import { ToastProvider } from './components/ToastNotification';
import Breadcrumb from './components/Breadcrumb';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import SolutionsPage from './pages/SolutionsPage';
import AITechnologyPage from './pages/AITechnologyPage';
import DashboardPreviewPage from './pages/DashboardPreviewPage';
import EnterprisePage from './pages/EnterprisePage';
import DocumentationPage from './pages/DocumentationPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import BillingHistoryPage from './pages/BillingHistoryPage';
import AssistantPage from './pages/AssistantPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import MonitoringPage from './pages/MonitoringPage';
import ModelCenterPage from './pages/ModelCenterPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Lazy load heavy portal pages for code splitting
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CustomerPortalPage = lazy(() => import('./pages/CustomerPortalPage'));
const AnalystPortalPage = lazy(() => import('./pages/AnalystPortalPage'));
const AdminPortalPage = lazy(() => import('./pages/AdminPortalPage'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="loader-container">
      <div className="spinner">Loading...</div>
    </div>
  );
}

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
      username: storedUsername,
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
    <DarkModeProvider>
      <ToastProvider />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/ai-technology" element={<AITechnologyPage />} />
          <Route path="/dashboard-preview" element={<DashboardPreviewPage />} />
          <Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<Layout token={auth.token} role={auth.role} username={auth.username} onLogout={handleLogout} theme={theme} onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}>
            <Route path="/dashboard" element={<ProtectedRoute token={auth.token}><Suspense fallback={<PageLoader />}><CustomerPortalPage user={auth} section="dashboard" /></Suspense></ProtectedRoute>} />
            <Route path="/customer/dashboard" element={<RoleRoute token={auth.token} allowedRoles={['CUSTOMER']}><Suspense fallback={<PageLoader />}><CustomerPortalPage user={auth} section="dashboard" /></Suspense></RoleRoute>} />
            <Route path="/ai-studio" element={<ProtectedRoute token={auth.token}><Suspense fallback={<PageLoader />}><CustomerPortalPage user={auth} section="ai-studio" /></Suspense></ProtectedRoute>} />
            <Route path="/submit-feedback" element={<ProtectedRoute token={auth.token}><Suspense fallback={<PageLoader />}><CustomerPortalPage user={auth} section="submit-feedback" /></Suspense></ProtectedRoute>} />
            <Route path="/prediction-history" element={<ProtectedRoute token={auth.token}><Suspense fallback={<PageLoader />}><CustomerPortalPage user={auth} section="prediction-history" /></Suspense></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute token={auth.token}><Suspense fallback={<PageLoader />}><CustomerPortalPage user={auth} section="subscription" /></Suspense></ProtectedRoute>} />
            <Route path="/help-support" element={<ProtectedRoute token={auth.token}><Suspense fallback={<PageLoader />}><CustomerPortalPage user={auth} section="help-support" /></Suspense></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="dashboard" /></Suspense></RoleRoute>} />
            <Route path="/admin/users" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="users" /></Suspense></RoleRoute>} />
            <Route path="/admin/requests" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="requests" /></Suspense></RoleRoute>} />
            <Route path="/admin/plans" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="plans" /></Suspense></RoleRoute>} />
            <Route path="/admin/ai" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="ai" /></Suspense></RoleRoute>} />
            <Route path="/admin/analytics" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="analytics" /></Suspense></RoleRoute>} />
            <Route path="/admin/alerts" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><AlertsPage /></RoleRoute>} />
            <Route path="/admin/reports" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="reports" /></Suspense></RoleRoute>} />
            <Route path="/admin/security" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="security" /></Suspense></RoleRoute>} />
            <Route path="/admin/logs" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="logs" /></Suspense></RoleRoute>} />
            <Route path="/admin/settings" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="settings" /></Suspense></RoleRoute>} />
            <Route path="/admin/profile" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="profile" /></Suspense></RoleRoute>} />
            <Route path="/admin/help" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="help" /></Suspense></RoleRoute>} />
            <Route path="/admin/assistant" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><Suspense fallback={<PageLoader />}><AdminPortalPage user={auth} section="assistant" /></Suspense></RoleRoute>} />
            <Route path="/analyst/dashboard" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="dashboard" /></Suspense></RoleRoute>} />
            <Route path="/analyst/analysis" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="analysis" /></Suspense></RoleRoute>} />
            <Route path="/analyst/upload" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="upload" /></Suspense></RoleRoute>} />
            <Route path="/analyst/analytics" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="analytics" /></Suspense></RoleRoute>} />
            <Route path="/analyst/trends" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="trends" /></Suspense></RoleRoute>} />
            <Route path="/analyst/insights" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="insights" /></Suspense></RoleRoute>} />
            <Route path="/analyst/review-queue" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="review-queue" /></Suspense></RoleRoute>} />
            <Route path="/analyst/reports" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="reports" /></Suspense></RoleRoute>} />
            <Route path="/analyst/datasets" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="datasets" /></Suspense></RoleRoute>} />
            <Route path="/analyst/history" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="history" /></Suspense></RoleRoute>} />
            <Route path="/analyst/notifications" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="notifications" /></Suspense></RoleRoute>} />
            <Route path="/analyst/profile" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="profile" /></Suspense></RoleRoute>} />
            <Route path="/analyst/settings" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="settings" /></Suspense></RoleRoute>} />
            <Route path="/analyst/help" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="help" /></Suspense></RoleRoute>} />
            <Route path="/analyst/assistant" element={<RoleRoute token={auth.token} allowedRoles={['ANALYST']}><Suspense fallback={<PageLoader />}><AnalystPortalPage user={auth} section="assistant" /></Suspense></RoleRoute>} />
            <Route path="/prediction" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN', 'MANAGER', 'ANALYST', 'CUSTOMER']}><PredictionPage token={auth.token} /></RoleRoute>} />
            <Route path="/analytics" element={<ProtectedRoute token={auth.token}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute token={auth.token}><HistoryPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute token={auth.token}><BillingHistoryPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute token={auth.token}><Suspense fallback={<PageLoader />}><ReportsPage /></Suspense></ProtectedRoute>} />
            <Route path="/assistant" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN', 'MANAGER', 'ANALYST', 'CUSTOMER']}><AssistantPage token={auth.token} /></RoleRoute>} />
            <Route path="/notifications" element={<ProtectedRoute token={auth.token}><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN']}><AdminPage /></RoleRoute>} />
            <Route path="/monitoring" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN', 'MANAGER']}><MonitoringPage /></RoleRoute>} />
            <Route path="/model-center" element={<RoleRoute token={auth.token} allowedRoles={['ADMIN', 'MANAGER', 'ANALYST']}><ModelCenterPage /></RoleRoute>} />
            <Route path="/settings" element={<ProtectedRoute token={auth.token}><SettingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute token={auth.token}><ProfilePage user={auth} /></ProtectedRoute>} />
          </Route>
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}
