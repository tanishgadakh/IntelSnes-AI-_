import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProfilePage from '../ProfilePage';

// Mock the api client to avoid network calls
vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { firstName: 'Test', lastName: 'User', email: 't@test.com' } }),
    put: vi.fn().mockResolvedValue({ data: { firstName: 'Test', lastName: 'User', email: 't@test.com' } })
  }
}));

describe('ProfilePage', () => {
  const user = { token: 'fake-token', username: 'tester', role: 'CUSTOMER' };

  it('requires current password when changing to a new password', async () => {
    render(<ProfilePage user={user} />);

    // wait for initial profile load
    await waitFor(() => expect(screen.getByDisplayValue('Test')).toBeInTheDocument());

    const newPasswordInput = screen.getByPlaceholderText('Leave blank to keep current password');
    const saveButton = screen.getByRole('button', { name: /save profile/i });

    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(saveButton);

    await waitFor(() => expect(screen.getByText('Current password is required to change your password.')).toBeInTheDocument());
  });
});
