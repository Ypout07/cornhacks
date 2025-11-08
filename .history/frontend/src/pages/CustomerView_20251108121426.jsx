// ============================================================================
// CustomerView.jsx
// ============================================================================
import { AlertCircle, CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import React, { useState } from 'react';
import { apiService } from "../apiService";

export function CustomerView({ setPage }) {
  const [batchUuid, setBatchUuid] = useState('');
  const [history, setHistory] = useState(null);
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!batchUuid.trim()) {
      setError('Please enter a batch UUID');
      return;
    }

    setLoading(true);
    setError(null);
    setHistory(null);
    setAudit(null);

    try {
      const [historyData, auditData] = await Promise.all([
        apiService.getBatchHistory(batchUuid),
        apiService.getBatchHistoryAudit(batchUuid)
      ]);

      if (historyData && historyData.length > 0) {
        setHistory(historyData);
        setAudit(auditData);
      } else {
        setError('No batch found with this UUID');
      }
    } catch (err) {
      setError('Failed to fetch batch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = audit?.trust_score === "Verified";
  const hasWarnings = audit?.warnings && audit.warnings.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setPage('home')}
          className="mb-6 text-blue-700 hover:text-blue-800 font-semibold flex items-center"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Search size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Customer Portal</h1>
              <p className="text-gray-600">Track your produce batch</p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={batchUuid}
              onChange={(e) => setBatchUuid(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Batch UUID (e.g., MOCK-FS-110825-A)"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center">
              <AlertCircle className="mr-2" size={20} />
              {error}
            </div>
          )}
        </div>

        {history && audit && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg flex items-center justify-between ${
              isVerified ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
            }`}>
              <div className="flex items-center">
                {isVerified ? (
                  <>
                    <CheckCircle className="text-green-600 mr-3" size={24} />
                    <div>
                      <p className="font-bold text-green-800">Blockchain Verified ✓</p>
                      <p className="text-sm text-green-700">All transfers authenticated</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-yellow-600 mr-3" size={24} />
                    <div>
                      <p className="font-bold text-yellow-800">Trust Score: {audit.trust_score}</p>
                      {hasWarnings && <p className="text-sm text-yellow-700">{audit.warnings.length} warning(s) detected</p>}
                    </div>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold text-gray-800">{history.length}</p>
              </div>
            </div>

            {hasWarnings && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2">⚠️ Warnings</h3>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {audit.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Batch Journey</h2>
              
              <div className="space-y-6">
                {history.map((transfer, index) => (
                  <div key={index} className="relative">
                    {index < history.length - 1 && (
                      <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-300" />
                    )}
                    
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-500' : index === history.length - 1 ? 'bg-blue-500' : 'bg-gray-400'
                      } text-white font-bold z-10`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{transfer.action}</h3>
                            <p className="text-gray-600">{transfer.actor_name}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            Verified
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-600" />
                            <div>
                              <p className="text-gray-600">Location</p>
                              <p className="font-semibold text-gray-800">
                                {transfer.latitude.toFixed(4)}, {transfer.longitude.toFixed(4)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-600" />
                            <div>
                              <p className="text-gray-600">Timestamp</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(transfer.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}