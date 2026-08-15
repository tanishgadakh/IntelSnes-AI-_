import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumb.css';

const breadcrumbNames = {
  '/dashboard': 'Dashboard',
  '/prediction': 'Prediction',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/history': 'History',
  '/admin': 'Admin',
  '/admin-portal': 'Admin Portal',
  '/analyst-portal': 'Analyst Portal',
  '/customer-portal': 'Customer Portal',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
  '/alerts': 'Alerts',
  '/monitoring': 'Monitoring',
  '/model-center': 'Model Center',
  '/assistant': 'Assistant',
  '/billing': 'Billing',
  '/about': 'About',
  '/features': 'Features',
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/dashboard" className="breadcrumb-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = breadcrumbNames[to] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to} className="breadcrumb-item">
              <ChevronRight size={16} className="breadcrumb-separator" />
              {last ? (
                <span className="breadcrumb-current">{displayName}</span>
              ) : (
                <Link to={to} className="breadcrumb-link">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
