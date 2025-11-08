// ============================================================================
// ProducerPortal.jsx
// ============================================================================
import { AlertCircle, CheckCircle, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { apiService } from "../apiService";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setPage('home')}
          className="mb-6 text-green-700 hover:text-green-800 font-semibold flex items-center"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Plus size={32} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Producer Portal</h1>
              <p className="text-gray-600">Manage your produce batches</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                mode === 'create'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Create New Batch
            </button>
            <button
              onClick={() => setMode('update')}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                mode === 'update'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Add Transfer
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle className="mr-2" size={20} /> : <AlertCircle className="mr-2" size={20} />}
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'update' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batch UUID
                </label>
                <input
                  type="text"
                  value={formData.batch_uuid}
                  onChange={(e) => setFormData({ ...formData, batch_uuid: e.target.value })}
                  placeholder="e.g., MOCK-FS-110825-A"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Actor Name
              </label>
              <input
                type="text"
                value={formData.actor_name}
                onChange={(e) => setFormData({ ...formData, actor_name: e.target.value })}
                placeholder="e.g., Green Valley Farm Co."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Action
              </label>
              <input
                type="text"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                placeholder="e.g., Harvested, Received, Shipped"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="e.g., 10.32"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="e.g., -84.22"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'create' ? 'Create Batch' : 'Add Transfer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}