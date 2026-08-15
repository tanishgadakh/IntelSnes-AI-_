import { useDarkMode } from './DarkMode';

export default function DarkModeToggle() {
  const { darkMode, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="theme-toggle-btn"
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={darkMode}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}
