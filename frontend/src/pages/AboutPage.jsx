// ============================================================================
// AboutPage.jsx
// ============================================================================
import { ArrowLeft, Package, Shield, TrendingUp, Users } from 'lucide-react';
import React from 'react';

export function AboutPage({ setPage }) {
  return (
    <div style={{ 
      background: '#0a1f0a', 
      minHeight: '100vh',
      color: 'white', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'auto'
    }}>
      {/* Header */}
      <header style={{ 
        position: 'fixed',
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '1.5rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 20,
        background: 'rgba(10, 31, 10, 0.95)',
        backdropFilter: 'blur(6px)'
      }}>
        <div 
          onClick={() => setPage('home')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <Package size={32} color="#86efac" strokeWidth={2} />
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', letterSpacing: '0.05em' }}>BANANA BLOCKCHAIN</span>
        </div>
        <button
          onClick={() => setPage('home')}
          style={{
            background: 'none',
            border: '2px solid rgba(134, 239, 172, 0.3)',
            color: '#86efac',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
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
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Home
        </button>
      </header>

      {/* Top fade overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '5rem',
        zIndex: 15,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #0a1f0a 0%, rgba(10,31,10,0) 100%)'
      }} />

      {/* Main Content */}
      <div style={{
        paddingTop: '8rem',
        paddingBottom: '4rem',
        minHeight: '100vh'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(134, 239, 172, 0.03) 1px, transparent 0)',
          backgroundSize: '48px 48px',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto',
          padding: '0 3rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Title Section */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '300', 
              marginBottom: '1rem',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: 'white'
            }}>
              About <span style={{ fontWeight: '600', color: '#86efac' }}>Banana Blockchain</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#d1fae5',
              fontWeight: '300',
              lineHeight: '1.7',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Revolutionizing supply chain transparency through blockchain technology
            </p>
          </div>

          {/* Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            
            {/* Section 1: Blockchain Security */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(134, 239, 172, 0.2)',
              borderRadius: '1rem',
              padding: '3rem',
              transition: 'all 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Shield size={28} color="#0a1f0a" strokeWidth={2} />
                </div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '600', 
                  color: 'white',
                  letterSpacing: '-0.01em',
                  margin: 0
                }}>
                  Blockchain Security
                </h2>
              </div>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#d1fae5',
                lineHeight: '1.8',
                fontWeight: '300',
                margin: 0
              }}>
                Every transaction on our platform is permanently and immutably recorded on the blockchain, which guarantees that the data cannot be altered or deleted. From the moment produce leaves the farm to the point it reaches the consumer, every step is logged in a secure, transparent ledger. This provides a complete and tamper-proof record of the entire supply chain, giving producers, distributors, and consumers peace of mind that the information they see is accurate, reliable, and fully auditable. By leveraging blockchain technology, we eliminate uncertainty and protect the integrity of your produce's journey.
              </p>
            </div>

            {/* Section 2: Real-Time Tracking */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(134, 239, 172, 0.2)',
              borderRadius: '1rem',
              padding: '3rem',
              transition: 'all 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <TrendingUp size={28} color="#0a1f0a" strokeWidth={2} />
                </div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '600', 
                  color: 'white',
                  letterSpacing: '-0.01em',
                  margin: 0
                }}>
                  Real-Time Tracking
                </h2>
              </div>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#d1fae5',
                lineHeight: '1.8',
                fontWeight: '300',
                margin: 0
              }}>
                Our platform allows you to monitor your produce in real-time, providing a live view of its journey from farm to table. Each transfer in the supply chain is captured with precise GPS coordinates, timestamps, and verification of the actors involved. This level of visibility enables producers and customers alike to track shipments with accuracy, anticipate delivery times, and quickly identify any issues along the route. Real-time tracking not only increases operational efficiency but also reinforces trust, as every movement of the produce is documented and accessible instantly.
              </p>
            </div>

            {/* Section 3: Consumer Trust */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(134, 239, 172, 0.2)',
              borderRadius: '1rem',
              padding: '3rem',
              transition: 'all 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Users size={28} color="#0a1f0a" strokeWidth={2} />
                </div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '600', 
                  color: 'white',
                  letterSpacing: '-0.01em',
                  margin: 0
                }}>
                  Consumer Trust
                </h2>
              </div>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#d1fae5',
                lineHeight: '1.8',
                fontWeight: '300',
                margin: 0
              }}>
                Transparency is the foundation of trust, and our system empowers consumers to see every step of their produce's journey. By providing full visibility into sourcing, handling, and delivery, verified through blockchain records, we give customers confidence that the information they see is authentic. Consumers can trust that the produce they purchase is fresh, responsibly sourced, and verified at every stage, strengthening loyalty and reinforcing your brand's commitment to quality and accountability. This complete traceability transforms uncertainty into assurance and builds long-term trust in your supply chain.
              </p>
            </div>

          </div>
        </div>
      </div>

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