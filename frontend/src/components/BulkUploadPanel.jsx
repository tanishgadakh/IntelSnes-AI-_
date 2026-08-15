import { useRef, useState } from 'react';
import api from '../api/client';
import { showToast } from './ToastNotification';

export default function BulkUploadPanel() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(csv|xlsx|json)$/i)) {
      showToast.error('Please upload a CSV, XLSX, or JSON file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('intelsense-token') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      };

      const response = await api.post('/api/prediction/bulk', formData, config);

      setResults({
        total: response.data.total || 0,
        processed: response.data.processed || 0,
        successful: response.data.successful || 0,
        failed: response.data.failed || 0,
        errors: response.data.errors || [],
      });

      showToast.success(
        `Bulk analysis complete: ${response.data.successful}/${response.data.total} successful`
      );
    } catch (error) {
      showToast.error(
        error?.response?.data?.message || 'Failed to process bulk upload'
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bulk-upload-panel glass-card">
      <div className="bulk-upload-header">
        <h3>Bulk Analysis Upload</h3>
        <p>Upload CSV, XLSX, or JSON files for batch processing</p>
      </div>

      <div className="bulk-upload-zone">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.json"
          onChange={handleFileSelect}
          disabled={uploading}
          aria-label="Upload file for bulk analysis"
          style={{ display: 'none' }}
        />
        <button
          className="button-link"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Click to select file"
        >
          {uploading ? `Uploading... ${uploadProgress}%` : '📁 Choose File'}
        </button>
      </div>

      {uploading && (
        <div className="progress-bar" aria-label={`Upload progress: ${uploadProgress}%`}>
          <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {results && (
        <div className="bulk-upload-results" role="region" aria-label="Upload results">
          <h4>Results</h4>
          <div className="results-grid">
            <div className="result-item">
              <span>Total Records</span>
              <strong>{results.total}</strong>
            </div>
            <div className="result-item">
              <span>Processed</span>
              <strong>{results.processed}</strong>
            </div>
            <div className="result-item success">
              <span>Successful</span>
              <strong>{results.successful}</strong>
            </div>
            <div className="result-item error">
              <span>Failed</span>
              <strong>{results.failed}</strong>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div className="errors-section">
              <h5>Errors ({results.errors.length})</h5>
              <ul>
                {results.errors.slice(0, 5).map((error, idx) => (
                  <li key={idx} className="error-item">
                    Row {error.row}: {error.message}
                  </li>
                ))}
                {results.errors.length > 5 && (
                  <li className="error-item">
                    ... and {results.errors.length - 5} more errors
                  </li>
                )}
              </ul>
            </div>
          )}

          <button
            className="ghost-btn"
            onClick={() => setResults(null)}
            aria-label="Clear results"
          >
            Clear Results
          </button>
        </div>
      )}
    </div>
  );
}
