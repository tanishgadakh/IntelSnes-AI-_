import { Link, useLocation } from 'react-router-dom';
import useAuthRole from '../hooks/useAuthRole';

export default function AccessDeniedPage() {
  const token = localStorage.getItem('intelsense-token');
  const role = useAuthRole(token);
  const location = useLocation();
  const requiredRoles = location.state?.requiredRoles || [];
  const requiredLabel = requiredRoles.length > 0 ? requiredRoles.join(' / ') : 'the required role';

  return (
    <div className="auth-shell access-denied-shell">
      <div className="auth-card access-denied-card">
        <div className="brand-block">
          <div className="brand-mark">!</div>
          <div>
            <h1>Access denied</h1>
            <p>It looks like your current account role does not permit access to this page.</p>
          </div>
        </div>
        <div className="access-hint">
          <p><strong>Current role:</strong> <span className="role-tag">{role}</span></p>
          <p><strong>Required role:</strong> <span className="role-tag">{requiredLabel}</span></p>
          <p>Ask an administrator to grant access for this feature.</p>
        </div>
        <div className="action-row">
          <Link to="/dashboard" className="secondary-btn">Return to dashboard</Link>
          <Link to="/profile" className="primary-btn">View profile</Link>
        </div>
      </div>
    </div>
  );
}
