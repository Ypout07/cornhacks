import { AlertCircle, ArrowLeft, CheckCircle, Clock, MapPin } from 'lucide-react';
import React from 'react';

export function CustomerView({ setPage, data }) {
  const { history, audit, batchUuid } = data || {};

  if (!history || !audit) {
    return (
      <div style={{ background: '#0a1f0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#86efac', fontSize: '1.5rem' }}>Loading...</p>
      </div>
    );
  }

  const isVerified = audit.trust_score === "Verified";
  const hasWarnings = audit.warnings && audit.warnings.length > 0;

  return (
    <div style={{ background: '#0a1f0a', minHeight: '100vh', color: 'white', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => setPage('home')}
          style={{ 
            marginBottom: '2rem', 
            color: '#86efac', 
            fontWeight: '600', 
            fontSize: '1.125rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d1fae5'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#86efac'}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '300', marginBottom: '0.5rem', color: 'white' }}>
            Batch <span style={{ fontWeight: '600', color: '#86efac' }}>{batchUuid}</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#a7f3d0', fontWeight: '300' }}>Complete verified journey</p>
        </div>

        {/* Verification Status */}
        <div style={{ 
          padding: '2rem', 
          borderRadius: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: isVerified ? 'rgba(134, 239, 172, 0.1)' : 'rgba(251, 191, 36, 0.1)',
          border: isVerified ? '2px solid #86efac' : '2px solid #fbbf24',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isVerified ? (
              <>
                <CheckCircle color="#86efac" size={40} strokeWidth={2.5} />
                <div>
                  <p style={{ fontWeight: '700', color: '#86efac', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Blockchain Verified ✓</p>
                  <p style={{ fontSize: '1rem', color: '#d1fae5' }}>All transfers authenticated</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle color="#fbbf24" size={40} strokeWidth={2.5} />
                <div>
                  <p style={{ fontWeight: '700', color: '#fbbf24', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Trust Score: {audit.trust_score}</p>
                  {hasWarnings && <p style={{ fontSize: '1rem', color: '#fde68a' }}>{audit.warnings.length} warning(s) detected</p>}
                </div>
              </>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', color: '#a7f3d0', marginBottom: '0.25rem' }}>Total Transfers</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#86efac' }}>{history.length}</p>
          </div>
        </div>

        {/* Warnings */}
        {hasWarnings && (
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.1)', 
            border: '2px solid #fbbf24', 
            borderRadius: '1rem', 
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontWeight: '700', color: '#fbbf24', marginBottom: '1rem', fontSize: '1.25rem' }}>⚠️ Warnings</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '1rem', color: '#fde68a' }}>
              {audit.warnings.map((warning, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Journey Timeline */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          borderRadius: '1rem', 
          border: '1px solid rgba(134, 239, 172, 0.1)',
          padding: '3rem' 
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', color: 'white', marginBottom: '2.5rem' }}>Batch Journey</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {history.map((transfer, index) => (
              <div key={index} style={{ position: 'relative' }}>
                {index < history.length - 1 && (
                  <div style={{ 
                    position: 'absolute', 
                    left: '2.5rem', 
                    top: '5rem', 
                    width: '2px', 
                    height: 'calc(100% + 1rem)', 
                    background: 'rgba(134, 239, 172, 0.2)' 
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
                    background: index === 0 ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' : 
                               index === history.length - 1 ? 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)' : 
                               'rgba(134, 239, 172, 0.2)',
                    color: index === 0 || index === history.length - 1 ? '#0a1f0a' : '#86efac', 
                    fontWeight: '700',
                    fontSize: '1.5rem',
                    zIndex: 10,
                    border: '2px solid rgba(134, 239, 172, 0.3)'
                  }}>
                    {index + 1}
                  </div>
                  
                  <div style={{ 
                    flex: 1, 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: '1rem', 
                    padding: '2rem', 
                    border: '1px solid rgba(134, 239, 172, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>{transfer.action}</h3>
                        <p style={{ fontSize: '1.125rem', color: '#a7f3d0' }}>{transfer.actor_name}</p>
                      </div>
                      <span style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.875rem', 
                        fontWeight: '600',
                        background: 'rgba(134, 239, 172, 0.2)', 
                        color: '#86efac',
                        border: '1px solid rgba(134, 239, 172, 0.3)'
                      }}>
                        Verified
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={20} color="#86efac" strokeWidth={2} />
                        <div>
                          <p style={{ color: '#a7f3d0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</p>
                          <p style={{ fontWeight: '600', color: 'white', fontSize: '1rem' }}>
                            {transfer.latitude.toFixed(4)}, {transfer.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={20} color="#86efac" strokeWidth={2} />
                        <div>
                          <p style={{ color: '#a7f3d0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Timestamp</p>
                          <p style={{ fontWeight: '600', color: 'white', fontSize: '1rem' }}>
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
    </div>
  );
}