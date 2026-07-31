export default function ConfirmModal({ open, title = 'Confirm', message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>{title}</h3>
        <div>{message}</div>
        <div className="action-row">
          <button className="secondary-btn" onClick={onCancel}>No</button>
          <button className="primary-btn" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}
