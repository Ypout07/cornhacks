// ============================================================================
// LogisticsPortal.jsx - Netflix-Inspired Design
// ============================================================================
import { ArrowRight, Package, Plus, Search, Shield, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';

export function LogisticsPortal({ setPage }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
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
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={40} color="#fbbf24" strokeWidth={2.5} />
          <span style={{ fontSize: '1.75rem', fontWeight: '900', color: '#fbbf24' }}>🍌 BANANA BLOCKCHAIN</span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
        borderBottom: '8px solid #1a1a1a'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />

        <div style={{ 
          position: 'relative',
          textAlign: 'center', 
          padding: '2rem',
          maxWidth: '1200px',
          zIndex: 1
        }}>
          <h1 style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            Track Your Produce.<br />
            <span style={{ color: '#fbbf24' }}>Trust the Chain.</span>
          </h1>
          <p style={{ 
            fontSize: '1.75rem', 
            color: '#d1d5db',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            lineHeight: '1.6'
          }}>
            Transparent, verifiable produce tracking powered by blockchain technology. From farm to table, every step authenticated.
          </p>
          
          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPage('producer')}
              style={{ 
                padding: '1.25rem 3rem',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1.5rem',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(251, 191, 36, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.4)';
              }}
            >
              <Plus size={28} strokeWidth={3} />
              Producer Portal
            </button>

            <button
              onClick={() => setPage('customer')}
              style={{ 
                padding: '1.25rem 3rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.375rem',
                fontSize: '1.5rem',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Search size={28} strokeWidth={3} />
              Track Your Batch
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 3rem', background: '#000' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: '900', 
            textAlign: 'center', 
            marginBottom: '4rem',
            color: 'white'
          }}>
            Why Choose Banana Blockchain?
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Feature Card 1 */}
            <div
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                background: hoveredCard === 1 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                padding: '3rem',
                borderRadius: '0.75rem',
                border: hoveredCard === 1 ? '2px solid #fbbf24' : '2px solid transparent',
                transition: 'all 0.3s',
                transform: hoveredCard === 1 ? 'translateY(-8px)' : 'translateY(0)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
              }}>
                <Shield size={40} color="white" strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>
                Blockchain Security
              </h3>
              <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: '1.7' }}>
                Every transaction is immutably recorded on the blockchain, ensuring complete transparency and tamper-proof records from origin to destination.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                background: hoveredCard === 2 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                padding: '3rem',
                borderRadius: '0.75rem',
                border: hoveredCard === 2 ? '2px solid #fbbf24' : '2px solid transparent',
                transition: 'all 0.3s',
                transform: hoveredCard === 2 ? 'translateY(-8px)' : 'translateY(0)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
              }}>
                <TrendingUp size={40} color="white" strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>
                Real-Time Tracking
              </h3>
              <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: '1.7' }}>
                Monitor your produce journey in real-time with GPS coordinates, timestamps, and actor verification at every step of the supply chain.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                background: hoveredCard === 3 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                padding: '3rem',
                borderRadius: '0.75rem',
                border: hoveredCard === 3 ? '2px solid #fbbf24' : '2px solid transparent',
                transition: 'all 0.3s',
                transform: hoveredCard === 3 ? 'translateY(-8px)' : 'translateY(0)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)'
              }}>
                <Users size={40} color="white" strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>
                Consumer Trust
              </h3>
              <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: '1.7' }}>
                Build confidence with consumers by providing full visibility into your produce's journey, verified by blockchain technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ 
        padding: '6rem 3rem', 
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: '900', 
            textAlign: 'center', 
            marginBottom: '4rem',
            color: 'white'
          }}>
            How It Works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            <div>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
                fontWeight: '900',
                color: '#000',
                boxShadow: '0 15px 40px rgba(251, 191, 36, 0.5)'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>Create Batch</h3>
              <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: '1.6' }}>
                Producers register new produce batches with location and details
              </p>
            </div>

            <div>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
                fontWeight: '900',
                color: 'white',
                boxShadow: '0 15px 40px rgba(16, 185, 129, 0.5)'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>Record Transfers</h3>
              <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: '1.6' }}>
                Each handoff in the supply chain is logged with verification
              </p>
            </div>

            <div>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
                fontWeight: '900',
                color: 'white',
                boxShadow: '0 15px 40px rgba(59, 130, 246, 0.5)'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>Track & Verify</h3>
              <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: '1.6' }}>
                Customers scan and view complete verified journey history
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ 
        padding: '6rem 3rem',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', color: 'white' }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: '1.5rem', color: '#d1d5db', marginBottom: '3rem' }}>
          Join the future of transparent food supply chains today.
        </p>
        <button
          onClick={() => setPage('producer')}
          style={{ 
            padding: '1.5rem 4rem',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.75rem',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 15px 50px rgba(251, 191, 36, 0.5)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(251, 191, 36, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(251, 191, 36, 0.5)';
          }}
        >
          Start Tracking Now
          <ArrowRight size={32} strokeWidth={3} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '3rem', 
        background: '#000', 
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          © 2025 Banana Blockchain. Powered by transparency and trust.
        </p>
      </footer>
    </div>
  );
}