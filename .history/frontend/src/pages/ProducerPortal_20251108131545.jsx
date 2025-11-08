// ============================================================================
// ProducerPortal.jsx
// ============================================================================
import { AlertCircle, CheckCircle, Plus } from 'lucide-react';
import React, { useState } from 'react';

// Mock apiService for preview - replace with: import { apiService } from "../apiService";
const apiService = {
  createBatch: async (data) => {
    return { message: 'Batch created successfully', batch_uuid: 'MOCK-FS-110825-A' };
  },
  addTransfer: async (data) => {
    return { message: 'Transfer added successfully' };
  }
};

export function ProducerPortal({ setPage }) {
  const [mode, setMode] = useState('create');
  const [formData, setFormData] = useState({
    batch_uuid: '',
    actor_name: '',
    action: '',
    latitude: '',
    longitude: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (mode === 'create') {
      if (!formData.actor_name || !formData.action || !formData.latitude || !formData.longitude) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        return;
      }
    } else {
      if (!formData.batch_uuid || !formData.actor_name || !formData.action || !formData.latitude || !formData.longitude) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        return;
      }
    }

    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'create') {
        const data = {
          actor_name: formData.actor_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        };
        const result = await apiService.createBatch(data);
        setMessage({ 
          type: 'success', 
          text: `${result.message} - Batch ID: ${result.batch_uuid}` 
        });
      } else {
        const data = {
          batch_uuid: formData.batch_uuid,
          actor_name: formData.actor_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        };
        const result = await apiService.addTransfer(data);
        setMessage({ type: 'success', text: result.message });
      }
      
      setFormData({
        batch_uuid: mode === 'update' ? formData.batch_uuid : '',
        actor_name: '',
        action: '',
        latitude: '',
        longitude: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #fef3c7 100%)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <button
          onClick={() => setPage('home')}
          style={{ marginBottom: '2rem', color: '#15803d', fontWeight: '700', fontSize: '1.125rem', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#166534'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#15803d'}
        >
          ← Back to Home
        </button>

        <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '3rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', borderRadius: '1rem', marginRight: '1.5rem' }}>
              <Plus size={48} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem' }}>Producer Portal</h1>
              <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Manage your produce batches</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', padding: '0.5rem', background: '#f3f4f6', borderRadius: '1rem' }}>
            <button
              onClick={() => setMode('create')}
              style={{ 
                flex: 1, 
                padding: '1rem 1.5rem', 
                borderRadius: '0.75rem', 
                fontWeight: '700',
                fontSize: '1.125rem',
                background: mode === 'create' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'transparent',
                color: mode === 'create' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                boxShadow: mode === 'create' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (mode !== 'create') e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                if (mode !== 'create') e.currentTarget.style.background = 'transparent';
              }}
            >
              Create New Batch
            </button>
            <button
              onClick={() => setMode('update')}
              style={{ 
                flex: 1, 
                padding: '1rem 1.5rem', 
                borderRadius: '0.75rem', 
                fontWeight: '700',
                fontSize: '1.125rem',
                background: mode === 'update' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'transparent',
                color: mode === 'update' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                boxShadow: mode === 'update' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (mode !== 'update') e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                if (mode !== 'update') e.currentTarget.style.background = 'transparent';
              }}
            >
              Add Transfer
            </button>
          </div>

          {/* Message */}
          {message && (
            <div style={{ 
              marginBottom: '2rem', 
              padding: '1.25rem', 
              borderRadius: '0.75rem', 
              display: 'flex', 
              alignItems: 'center',
              background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              border: message.type === 'success' ? '3px solid #86efac' : '3px solid #fecaca',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              {message.type === 'success' ? <CheckCircle style={{ marginRight: '0.75rem' }} size={24} /> : <AlertCircle style={{ marginRight: '0.75rem' }} size={24} />}
              {message.text}
            </div>
          )}

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mode === 'update' && (
              <div>
                <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                  Batch UUID
                </label>
                <input
                  type="text"
                  value={formData.batch_uuid}
                  onChange={(e) => setFormData({ ...formData, batch_uuid: e.target.value })}
                  placeholder="e.g., MOCK-FS-110825-A"
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.25rem', 
                    border: '3px solid #e5e7eb', 
                    borderRadius: '0.75rem',
                    fontSize: '1.125rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                Actor Name
              </label>
              <input
                type="text"
                value={formData.actor_name}
                onChange={(e) => setFormData({ ...formData, actor_name: e.target.value })}
                placeholder="e.g., Green Valley Farm Co."
                style={{ 
                  width: '100%', 
                  padding: '1rem 1.25rem', 
                  border: '3px solid #e5e7eb', 
                  borderRadius: '0.75rem',
                  fontSize: '1.125rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                Action
              </label>
              <input
                type="text"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                placeholder="e.g., Harvested, Received, Shipped"
                style={{ 
                  width: '100%', 
                  padding: '1rem 1.25rem', 
                  border: '3px solid #e5e7eb', 
                  borderRadius: '0.75rem',
                  fontSize: '1.125rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="e.g., 10.32"
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.25rem', 
                    border: '3px solid #e5e7eb', 
                    borderRadius: '0.75rem',
                    fontSize: '1.125rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="e.g., -84.22"
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.25rem', 
                    border: '3px solid #e5e7eb', 
                    borderRadius: '0.75rem',
                    fontSize: '1.125rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ 
                width: '100%', 
                background: loading ? '#86efac' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
                color: 'white', 
                fontWeight: '900', 
                padding: '1.25rem 1.5rem', 
                borderRadius: '0.75rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.25rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(34, 197, 94, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              {loading ? 'Processing...' : mode === 'create' ? 'Create Batch' : 'Add Transfer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}