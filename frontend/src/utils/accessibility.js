// Accessibility utilities for WCAG 2.1 AA compliance

export const accessibilityEnhancements = {
  // Keyboard navigation helper
  handleKeyboardNav: (event, callbacks) => {
    const { Enter, Escape, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } = callbacks;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        Enter?.();
        break;
      case 'Escape':
        event.preventDefault();
        Escape?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        ArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        ArrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        ArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        ArrowRight?.();
        break;
      default:
        break;
    }
  },

  // Generate ARIA labels
  getAriaLabel: (type, data) => {
    const labels = {
      'notification-badge': (count) => `You have ${count} unread notifications`,
      'alert-item': (alert) => `${alert.level} alert: ${alert.message}`,
      'kpi-card': (label, value) => `${label}: ${value}`,
      'filter-chip': (name, active) => `${name} filter, ${active ? 'active' : 'inactive'}`,
      'pagination': (current, total) => `Page ${current} of ${total}`,
    };
    
    const labelFn = labels[type];
    return labelFn ? labelFn(data) : '';
  },

  // Screen reader announcements
  announceToScreenReader: (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
  },

  // Focus management
  focusElement: (element) => {
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  // Skip to main content
  createSkipLink: () => {
    const link = document.createElement('a');
    link.href = '#main-content';
    link.textContent = 'Skip to main content';
    link.className = 'skip-link';
    return link;
  },
};

// CSS for accessibility
export const accessibilityCSS = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: white;
    padding: 8px;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }

  button:focus,
  a:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: 3px solid #4f46e5;
    outline-offset: 2px;
  }

  .focus-visible {
    outline: 3px solid #4f46e5 !important;
    outline-offset: 2px;
  }
`;
