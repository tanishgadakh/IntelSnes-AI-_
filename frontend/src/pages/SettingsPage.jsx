import { useMemo, useState } from 'react';
import { showToast } from '../components/ToastNotification';
import EmailExportScheduler from '../components/EmailExportScheduler';
import DarkModeToggle from '../components/DarkModeToggle';
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring';

const initialPreferences = {
  notifications: true,
  weeklyReports: true,
  darkMode: true,
  compactView: false,
  language: 'English',
  timezone: 'UTC',
};

export default function SettingsPage() {
  usePerformanceMonitoring('SettingsPage');
  const [preferences, setPreferences] = useState(initialPreferences);

  const preferenceCards = useMemo(() => [
    { label: 'Email notifications', value: preferences.notifications ? 'Enabled' : 'Disabled' },
    { label: 'Weekly report digest', value: preferences.weeklyReports ? 'Scheduled' : 'Off' },
    { label: 'Appearance', value: preferences.darkMode ? 'Dark mode' : 'Light mode' },
    { label: 'Layout', value: preferences.compactView ? 'Compact' : 'Comfortable' },
  ], [preferences]);

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    showToast.success('Preferences updated');
  };

  return (
    <div className="dashboard-grid analytics-page">
      <div className="hero-card analytics-hero">
        <div>
          <h2>Workspace settings</h2>
          <p>Control notifications, alerts, layout, and account preferences.</p>
        </div>
      </div>

      <div className="metric-card">
        <p>Theme</p>
        <h3>{preferences.darkMode ? 'Dark mode' : 'Light mode'}</h3>
        <span>Applies to the entire workspace</span>
      </div>
      <div className="metric-card">
        <p>Language</p>
        <h3>{preferences.language}</h3>
        <span>Preferred interface language</span>
      </div>
      <div className="metric-card">
        <p>Timezone</p>
        <h3>{preferences.timezone}</h3>
        <span>Scheduled report timezone</span>
      </div>
      <div className="metric-card">
        <p>Security</p>
        <h3>2FA enabled</h3>
        <span>OTP protection active</span>
      </div>

      <div className="chart-card wide">
        <h3>Preference controls</h3>
        <div className="settings-list">
          <label className="toggle-row">
            <span>Enable in-app notifications</span>
            <input type="checkbox" checked={preferences.notifications} onChange={(e) => updatePreference('notifications', e.target.checked)} />
          </label>
          <label className="toggle-row">
            <span>Send weekly reports</span>
            <input type="checkbox" checked={preferences.weeklyReports} onChange={(e) => updatePreference('weeklyReports', e.target.checked)} />
          </label>
          <label className="toggle-row">
            <span>Use dark mode</span>
            <input type="checkbox" checked={preferences.darkMode} onChange={(e) => updatePreference('darkMode', e.target.checked)} />
          </label>
          <label className="toggle-row">
            <span>Compact workspace view</span>
            <input type="checkbox" checked={preferences.compactView} onChange={(e) => updatePreference('compactView', e.target.checked)} />
          </label>

          <div className="settings-selects">
            <label>
              Language
              <select value={preferences.language} onChange={(e) => updatePreference('language', e.target.value)}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </label>
            <label>
              Timezone
              <select value={preferences.timezone} onChange={(e) => updatePreference('timezone', e.target.value)}>
                <option>UTC</option>
                <option>EST</option>
                <option>IST</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3>Appearance Settings</h3>
        <div style={{ padding: '1rem 0' }}>
          <p>Quick access to theme toggle:</p>
          <DarkModeToggle />
        </div>
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <EmailExportScheduler />
      </div>

      <div className="chart-card">
        <h3>Current profile summary</h3>
        <ul className="settings-summary">
          {preferenceCards.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
