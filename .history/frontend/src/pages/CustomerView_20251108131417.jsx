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
    <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #cffafe 100%)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <button
          onClick={() => setPage('home')}
          style={{ marginBottom: '2rem', color: '#1d4ed8', fontWeight: '700', fontSize: '1.125rem', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1e40af'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#1d4ed8'}
        >
          ← Back to Home
        </button>

        {/* Search Card */}
        <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '3rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '1rem', marginRight: '1.5rem' }}>
              <Search size={48} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem' }}>Customer Portal</h1>
              <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Track your produce batch</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={batchUuid}
              onChange={(e) => setBatchUuid(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Batch UUID (e.g., MOCK-FS-110825-A)"
              style={{ 
                flex: 1, 
                padding: '1rem 1.25rem', 
                border: '3px solid #e5e7eb', 
                borderRadius: '0.75rem', 
                fontSize: '1.125rem',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{ 
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                color: 'white', 
                fontWeight: '700', 
                padding: '1rem 2.5rem', 
                borderRadius: '0.75rem', 
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.125rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#fef2f2', color: '#991b1b', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', border: '2px solid #fecaca' }}>
              <AlertCircle style={{ marginRight: '0.75rem' }} size={24} />
              <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>{error}</span>
            </div>
          )}
        </div>

        {history && audit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Verification Status Card */}
            <div style={{ 
              padding: '1.75rem', 
              borderRadius: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: isVerified ? '#f0fdf4' : '#fefce8',
              border: isVerified ? '3px solid #86efac' : '3px solid #fde047',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isVerified ? (
                  <>
                    <CheckCircle color="#16a34a" style={{ marginRight: '1rem' }} size={36} strokeWidth={2.5} />
                    <div>
                      <p style={{ fontWeight: '900', color: '#166534', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Blockchain Verified ✓</p>
                      <p style={{ fontSize: '1.125rem', color: '#15803d' }}>All transfers authenticated</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle color="#ca8a04" style={{ marginRight: '1rem' }} size={36} strokeWidth={2.5} />
                    <div>
                      <p style={{ fontWeight: '900', color: '#854d0e', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Trust Score: {audit.trust_score}</p>
                      {hasWarnings && <p style={{ fontSize: '1.125rem', color: '#a16207' }}>{audit.warnings.length} warning(s) detected</p>}
                    </div>
                  </>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Transfers</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937' }}>{history.length}</p>
              </div>
            </div>

            {/* Warnings */}
            {hasWarnings && (
              <div style={{ background: '#fefce8', border: '3px solid #fde047', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: '900', color: '#854d0e', marginBottom: '1rem', fontSize: '1.5rem' }}>⚠️ Warnings</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '1.125rem', color: '#a16207' }}>
                  {audit.warnings.map((warning, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Batch Journey */}
            <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '3rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1f2937', marginBottom: '2.5rem' }}>Batch Journey</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {history.map((transfer, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    {index < history.length - 1 && (
                      <div style={{ 
                        position: 'absolute', 
                        left: '2.5rem', 
                        top: '5rem', 
                        width: '3px', 
                        height: 'calc(100% + 1rem)', 
                        background: '#d1d5db' 
                      }} />
                    )}
                    
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <div style={{ 
                        flexShrink: 0, 
                        width: '5rem', 
                        height: '5rem', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: index === 0 ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 
                                   index === history.length - 1 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 
                                   '#9ca3af',
                        color: 'white', 
                        fontWeight: '900',
                        fontSize: '1.5rem',
                        zIndex: 10,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        {index + 1}
                      </div>
                      
                      <div style={{ 
                        flex: 1, 
                        background: '#f9fafb', 
                        borderRadius: '1rem', 
                        padding: '2rem', 
                        border: '3px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem' }}>{transfer.action}</h3>
                            <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>{transfer.actor_name}</p>
                          </div>
                          <span style={{ 
                            padding: '0.5rem 1.25rem', 
                            borderRadius: '9999px', 
                            fontSize: '1rem', 
                            fontWeight: '700',
                            background: '#d1fae5', 
                            color: '#065f46'
                          }}>
                            Verified
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', fontSize: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MapPin size={24} color="#6b7280" strokeWidth={2} />
                            <div>
                              <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                              <p style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.125rem' }}>
                                {transfer.latitude.toFixed(4)}, {transfer.longitude.toFixed(4)}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Clock size={24} color="#6b7280" strokeWidth={2} />
                            <div>
                              <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Timestamp</p>
                              <p style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.125rem' }}>
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