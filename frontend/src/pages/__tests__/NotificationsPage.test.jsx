import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NotificationsPage from '../NotificationsPage';
import api from '../../api/client';

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('NotificationsPage', () => {
  it('loads notifications from the backend alerts endpoint', async () => {
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          level: 'warning',
          message: 'Delivery issue detected',
          payload: { source: 'shipment' },
          created_at: '2026-08-15T12:00:00Z',
        },
      ],
    });

    render(<NotificationsPage />);

    expect(await screen.findByText(/delivery issue detected/i)).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/api/alerts', expect.any(Object));
  });
});
