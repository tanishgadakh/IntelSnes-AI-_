import { useEffect, useState } from 'react';
import api from '../api/client';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminPage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const token = localStorage.getItem('intelsense-token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const loadPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/pending-requests', { headers });
      setPendingRequests(response.data || []);
    } catch (error) {
      setToastMessage(error?.response?.data?.message || 'Unable to load pending requests.');
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id, action, payload = null) => {
    setLoading(true);
    try {
      await api.post(`/api/admin/users/${id}/${action}`, payload, { headers });
      const successText = action === 'approve' ? 'approved' : 'rejected';
      setBannerType('success');
      setBannerMessage(`Request ${successText} successfully.`);
      setToastMessage('');
      await loadPendingRequests();
      setSelectedRequest(null);
      setRejectModalOpen(false);
      setRejectReason('');
    } catch (error) {
      const message = error?.response?.data?.message || `Unable to ${action} request.`;
      setBannerType('error');
      setBannerMessage(message);
      setToastMessage('');
    } finally {
      setLoading(false);
    }
  };

  const closeBanner = () => {
    setBannerMessage('');
  };

  useEffect(() => {
    loadPendingRequests();
  }, []);

  useEffect(() => {
    if (!bannerMessage) return;
    const timer = setTimeout(() => {
      setBannerMessage('');
    }, 4000);
    return () => clearTimeout(timer);
  }, [bannerMessage]);

  return (
    <div className="admin-page">
      <div className="hero-card admin-hero">
        <h2>Admin control center</h2>
        <p>Review pending user registrations and approve access for analysts.</p>
      </div>

      <div className="panel admin-table-panel">
        <div className="panel-header">
          <h3>Pending access requests</h3>
          <p>Approve or reject analyst registration requests before they can access the workspace.</p>
        </div>
        {bannerMessage && (
          <div className={`admin-banner ${bannerType}`}>
            <span>{bannerMessage}</span>
            <button className="banner-close" type="button" onClick={closeBanner} aria-label="Close notification">×</button>
          </div>
        )}
        {loading && <p className="panel-note">Loading requests...</p>}
        {!loading && pendingRequests.length === 0 && (
          <p className="panel-note">No pending requests at the moment.</p>
        )}
        {!loading && pendingRequests.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.firstName} {request.lastName}</td>
                    <td>{request.email}</td>
                    <td>{request.company}</td>
                    <td>{request.role}</td>
                    <td>{request.status}</td>
                    <td>
                      <button className="action-btn view" onClick={() => setSelectedRequest(request)} disabled={loading}>View Details</button>
                      <button className="action-btn approve" onClick={() => updateRequest(request.id, 'approve')} disabled={loading}>Approve</button>
                      <button className="action-btn reject" onClick={() => { setSelectedRequest(request); setRejectModalOpen(true); }} disabled={loading}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedRequest && (
              <div className="panel request-details-panel">
                <h4>Request details</h4>
                <p><strong>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Phone:</strong> {selectedRequest.phone || '—'}</p>
                <p><strong>Company:</strong> {selectedRequest.company || '—'}</p>
                <p><strong>Department:</strong> {selectedRequest.department || '—'}</p>
                <p><strong>Job Title:</strong> {selectedRequest.jobTitle || '—'}</p>
                <p><strong>Experience:</strong> {selectedRequest.experience || '—'} Years</p>
                <p><strong>Reason:</strong> {selectedRequest.reasonForAccess || '—'}</p>
              </div>
            )}
          </>
        )}
      </div>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} duration={3500} />
      <ConfirmModal
        open={rejectModalOpen}
        title="Reject registration"
        message={
          <div>
            <p>Provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Incomplete company information"
              style={{ width: '100%', minHeight: '100px', marginTop: '1rem', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white' }}
            />
          </div>
        }
        onConfirm={() => updateRequest(selectedRequest?.id, 'reject', { reason: rejectReason || 'Not specified' })}
        onCancel={() => setRejectModalOpen(false)}
      />
    </div>
  );
}
