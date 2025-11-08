// ============================================================================
// LogisticsPortal.jsx - Premium Green & White Design
// ============================================================================
import { ArrowRight, Package, Plus, Search, Shield, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';

export function LogisticsPortal({ setPage }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ background: '#0a1f0a', minHeight: '100vh', color: 'white', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '1.5rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(10, 31, 10, 0.95) 0%, rgba(10, 31, 10, 0) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={32} color="#86efac" strokeWidth={2} />
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', letterSpacing: '0.05em' }}>BANANA BLOCKCHAIN</span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1f0a 0%, #14532d 50%, #0a1f0a 100%)',
        borderBottom: '1px solid rgba(134, 239, 172, 0.1)'
      }}>
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(134, 239, 172, 0.03) 1px, transparent 0)',
          backgroundSize: '48px 48px',
          opacity: 0.4
        }} />

        <div style={{ 
          position: 'relative',
          textAlign: 'center', 
          padding: '2rem',
          maxWidth: '900px',
          zIndex: 1
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '300', 
            marginBottom: '1.5rem',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            color: 'white'
          }}>
            Track Your Produce.<br />
            <span style={{ fontWeight: '600', color: '#86efac' }}>Trust the Chain.</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#d1fae5',
            marginBottom: '2.5rem',
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
            fontWeight: '300'
          }}>
            Transparent, verifiable produce tracking powered by blockchain technology. From farm to table, every step authenticated.
          </p>
          
          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPage('producer')}
              style={{ 
                padding: '0.875rem 2rem',
                background: '#86efac',
                color: '#0a1f0a',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(134, 239, 172, 0.3)',
                transition: 'all 0.3s',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(134, 239, 172, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(134, 239, 172, 0.3)';
              }}
            >
              <Plus size={20} strokeWidth={2.5} />
              Producer Portal
            </button>

            <button
              onClick={() => setPage('customer')}
              style={{ 
                padding: '0.875rem 2rem',
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(134, 239, 172, 0.3)',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#86efac';
                e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Search size={20} strokeWidth={2.5} />
              Track Your Batch
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 3rem', background: '#0a1f0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: '300', 
            textAlign: 'center', 
            marginBottom: '3.5rem',
            color: 'white',
            letterSpacing: '-0.01em'
          }}>
            Why Choose <span style={{ fontWeight: '600', color: '#86efac' }}>Banana Blockchain</span>
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Feature Card 1 */}
            <div
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                background: hoveredCard === 1 ? 'rgba(134, 239, 172, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                padding: '2.5rem',
                borderRadius: '1rem',
                border: hoveredCard === 1 ? '1px solid #86efac' : '1px solid rgba(134, 239, 172, 0.1)',
                transition: 'all 0.4s ease',
                transform: hoveredCard === 1 ? 'translateY(-4px)' : 'translateY(0)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <Shield size={28} color="#0a1f0a" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>
                Blockchain Security
              </h3>
              <p style={{ fontSize: '1rem', color: '#a7f3d0', lineHeight: '1.6', fontWeight: '300' }}>
                Every transaction is immutably recorded on the blockchain, ensuring complete transparency and tamper-proof records from origin to destination.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                background: hoveredCard === 2 ? 'rgba(134, 239, 172, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                padding: '2.5rem',
                borderRadius: '1rem',
                border: hoveredCard === 2 ? '1px solid #86efac' : '1px solid rgba(134, 239, 172, 0.1)',
                transition: 'all 0.4s ease',
                transform: hoveredCard === 2 ? 'translateY(-4px)' : 'translateY(0)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <TrendingUp size={28} color="#0a1f0a" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>
                Real-Time Tracking
              </h3>
              <p style={{ fontSize: '1rem', color: '#a7f3d0', lineHeight: '1.6', fontWeight: '300' }}>
                Monitor your produce journey in real-time with GPS coordinates, timestamps, and actor verification at every step of the supply chain.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                background: hoveredCard === 3 ? 'rgba(134, 239, 172, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                padding: '2.5rem',
                borderRadius: '1rem',
                border: hoveredCard === 3 ? '1px solid #86efac' : '1px solid rgba(134, 239, 172, 0.1)',
                transition: 'all 0.4s ease',
                transform: hoveredCard === 3 ? 'translateY(-4px)' : 'translateY(0)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <Users size={28} color="#0a1f0a" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>
                Consumer Trust
              </h3>
              <p style={{ fontSize: '1rem', color: '#a7f3d0', lineHeight: '1.6', fontWeight: '300' }}>
                Build confidence with consumers by providing full visibility into your produce's journey, verified by blockchain technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ 
        padding: '5rem 3rem', 
        background: 'linear-gradient(180deg, #0a1f0a 0%, #14532d 50%, #0a1f0a 100%)',
        borderTop: '1px solid rgba(134, 239, 172, 0.1)',
        borderBottom: '1px solid rgba(134, 239, 172, 0.1)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: '300', 
            textAlign: 'center', 
            marginBottom: '3.5rem',
            color: 'white',
            letterSpacing: '-0.01em'
          }}>
            How It Works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            <div>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                fontWeight: '600',
                color: '#0a1f0a'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Create Batch</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Producers register new produce batches with location and details
              </p>
            </div>

            <div>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                fontWeight: '600',
                color: '#0a1f0a'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Record Transfers</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Each handoff in the supply chain is logged with verification
              </p>
            </div>

            <div>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                fontWeight: '600',
                color: '#0a1f0a'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Track & Verify</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Customers scan and view complete verified journey history
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ 
        padding: '5rem 3rem',
        background: '#0a1f0a',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '1rem', color: 'white', letterSpacing: '-0.02em' }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#d1fae5', marginBottom: '2.5rem', fontWeight: '300' }}>
          Join the future of transparent food supply chains today.
        </p>
        <button
          onClick={() => setPage('producer')}
          style={{ 
            padding: '1rem 2.5rem',
            background: '#86efac',
            color: '#0a1f0a',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 8px 30px rgba(134, 239, 172, 0.3)',
            transition: 'all 0.3s',
            letterSpacing: '0.01em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(134, 239, 172, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(134, 239, 172, 0.3)';
          }}
        >
          Start Tracking Now
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '2.5rem', 
        background: '#0a1f0a', 
        textAlign: 'center',
        borderTop: '1px solid rgba(134, 239, 172, 0.1)'
      }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '300' }}>
          © 2025 Banana Blockchain. Powered by transparency and trust.
        </p>
      </footer>
    </div>
  );
}