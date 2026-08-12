import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ModelCenterPage() {
  const token = localStorage.getItem('intelsense-token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const [models, setModels] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadModels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/models', { headers });
      setModels(res.data || null);
    } catch (e) {
      setModels(null);
    } finally {
      setLoading(false);
    }
  };

  const switchModel = async (model, version) => {
    setLoading(true);
    try {
      await api.post('/api/admin/models/switch', { model, version }, { headers });
      await loadModels();
      alert('Model switched: ' + model + ' -> ' + version);
    } catch (e) {
      alert('Failed to switch model');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadModels(); }, []);

  return (
    <div className="panel">
      <h2>AI model center</h2>
      <p>Review and manage model versions used by the AI assistant.</p>
      {loading && <p className="panel-note">Loading...</p>}
      {!loading && models && (
        <div className="model-grid">
          {Object.entries(models.models || {}).map(([key, val]) => (
            <div key={key} className="model-card">
              <p>{key}</p>
              <h3>{String(val || 'unknown')}</h3>
              <div style={{ marginTop: '0.6rem' }}>
                <button onClick={() => switchModel(key, 'default')}>Use real model</button>
                <button onClick={() => switchModel(key, 'dummy')} style={{ marginLeft: '0.6rem' }}>Use dummy</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !models && (
        <p className="panel-note">Unable to load model information.</p>
      )}
    </div>
  );
}
