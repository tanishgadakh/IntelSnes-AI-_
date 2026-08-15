import { useState } from 'react';
import api from '../api/client';
import { showToast } from './ToastNotification';

export default function EmailExportScheduler() {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'analytics',
    frequency: 'weekly',
    email: localStorage.getItem('intelsense-email') || '',
    time: '09:00',
    enabled: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const response = await api.post('/api/export/schedule', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedules([...schedules, response.data]);
      setShowForm(false);
      setFormData({
        reportType: 'analytics',
        frequency: 'weekly',
        email: formData.email,
        time: '09:00',
        enabled: true,
      });

      showToast.success('Export schedule created successfully');
    } catch (error) {
      showToast.error(
        error?.response?.data?.message || 'Failed to create export schedule'
      );
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      const token = localStorage.getItem('intelsense-token') || '';
      await api.delete(`/api/export/schedule/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedules(schedules.filter((s) => s.id !== scheduleId));
      showToast.success('Schedule deleted');
    } catch (error) {
      showToast.error('Failed to delete schedule');
    }
  };

  const handleToggle = async (scheduleId, enabled) => {
    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const response = await api.put(
        `/api/export/schedule/${scheduleId}`,
        { enabled: !enabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSchedules(
        schedules.map((s) =>
          s.id === scheduleId ? response.data : s
        )
      );
    } catch (error) {
      showToast.error('Failed to update schedule');
    }
  };

  return (
    <div className="email-export-scheduler glass-card">
      <div className="scheduler-header">
        <h3>Email Export Schedule</h3>
        <button
          className="button-link"
          onClick={() => setShowForm(!showForm)}
          aria-label={showForm ? 'Cancel' : 'Create new export schedule'}
        >
          {showForm ? '✕ Cancel' : '+ New Schedule'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="export-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              aria-label="Email address for exports"
            />
          </div>

          <div className="form-group">
            <label htmlFor="report-type">Report Type</label>
            <select
              id="report-type"
              value={formData.reportType}
              onChange={(e) =>
                setFormData({ ...formData, reportType: e.target.value })
              }
              aria-label="Type of report to export"
            >
              <option value="analytics">Analytics</option>
              <option value="predictions">Predictions</option>
              <option value="recommendations">Recommendations</option>
              <option value="full">Full Report</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Frequency</label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              aria-label="Export frequency"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="time">Time of Day</label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              aria-label="Time to send export"
            />
          </div>

          <button type="submit" className="button">
            Create Schedule
          </button>
        </form>
      )}

      {schedules.length > 0 && (
        <div className="schedules-list" role="list">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="schedule-item glass-card"
              role="listitem"
            >
              <div className="schedule-info">
                <h4>{schedule.reportType}</h4>
                <p>
                  {schedule.frequency.charAt(0).toUpperCase() +
                    schedule.frequency.slice(1)}{' '}
                  at {schedule.time}
                </p>
                <p className="text-muted">{schedule.email}</p>
              </div>
              <div className="schedule-actions">
                <button
                  onClick={() =>
                    handleToggle(schedule.id, schedule.enabled)
                  }
                  className={`icon-btn ${
                    schedule.enabled ? 'active' : 'inactive'
                  }`}
                  aria-label={
                    schedule.enabled
                      ? 'Disable schedule'
                      : 'Enable schedule'
                  }
                >
                  {schedule.enabled ? '✓' : '○'}
                </button>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="icon-btn danger"
                  aria-label="Delete schedule"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
