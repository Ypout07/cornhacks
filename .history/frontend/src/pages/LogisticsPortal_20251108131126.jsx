// ============================================================================
// LogisticsPortal.jsx
// ============================================================================
import { ArrowRight, Package, Plus, Search } from 'lucide-react';
import React from 'react';

export function LogisticsPortal({ setPage }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', width: '100%', margin: '0 auto' }}>
        {/* Icon and Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ padding: '3rem', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', borderRadius: '9999px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', marginBottom: '2rem' }}>
            <Package size={100} color="#78350f" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
            🍌 Banana Blockchain
          </h1>
          <div style={{ width: '8rem', height: '0.375rem', background: 'linear-gradient(to right, #fbbf24, #10b981)', borderRadius: '9999px', marginBottom: '1.5rem' }}></div>
          <p style={{ fontSize: '1.875rem', color: '#374151', maxWidth: '48rem', lineHeight: '2.25rem', fontWeight: '500' }}>
            Transparent, verifiable produce tracking from farm to table
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '80rem', margin: '0 auto' }}>
          <button
            onClick={() => setPage('producer')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem', 
              background: 'white', 
              borderRadius: '1.5rem', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '4px solid #86efac',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', borderRadius: '1.5rem', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <Plus size={72} color="white" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1.5rem' }}>Producer</h2>
            <p style={{ color: '#4b5563', fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center', lineHeight: '1.75rem', padding: '0 1rem' }}>
              Create new batches and record transfers as produce moves through the supply chain
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#16a34a', fontWeight: '700', fontSize: '1.25rem', gap: '0.75rem' }}>
              Get Started 
              <div style={{ background: '#bbf7d0', borderRadius: '9999px', padding: '0.75rem' }}>
                <ArrowRight size={28} strokeWidth={3} />
              </div>
            </div>
          </button>

          <button
            onClick={() => setPage('customer')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem', 
              background: 'white', 
              borderRadius: '1.5rem', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '4px solid #93c5fd',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '1.5rem', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <Search size={72} color="white" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1.5rem' }}>Customer</h2>
            <p style={{ color: '#4b5563', fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center', lineHeight: '1.75rem', padding: '0 1rem' }}>
              Verify the complete journey of your produce with full blockchain transparency
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#2563eb', fontWeight: '700', fontSize: '1.25rem', gap: '0.75rem' }}>
              Track Batch
              <div style={{ background: '#bfdbfe', borderRadius: '9999px', padding: '0.75rem' }}>
                <ArrowRight size={28} strokeWidth={3} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}