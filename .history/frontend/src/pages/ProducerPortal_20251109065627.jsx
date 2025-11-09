// ============================================================================
// ProducerPortal.jsx
// ============================================================================

// ============================================================================
// LogisticsPortal.jsx
// ============================================================================
import { Package, Search, Shield, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import { getBatchHistoryAudit, getCrateHistory } from '../apiService';

// Animated Map Background Component
function AnimatedMapBackground() {
  const canvasRef = React.useRef(null); 

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Random moving particles
    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    let animationFrame;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `rgba(134, 239, 172, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(134, 239, 172, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby particles
        particles.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(134, 239, 172, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.4
      }}
    />
  );
}

export function LogisticsPortal({ setPage }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [batchUuid, setBatchUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = async () => {
    if (!batchUuid.trim()) {
      setError('Please enter a Crate ID');
      return;
    }

    setLoading(true);
    setError('');

    // We get the full crate ID from your form's state (which is 'batchUuid')
    const fullCrateId = batchUuid.trim(); 
    const lastDashIndex = fullCrateId.lastIndexOf('-');
    
    // Check if it's a valid crate ID
    if (lastDashIndex === -1 || !fullCrateId.includes('-CRATE_')) {
      setError("Invalid ID. Please scan or type a full Crate ID (e.g., BATCH-ID-CRATE_1)");
      setLoading(false);
      return;
    }
    
    // Split the ID into the parts we need for the API calls
    const parsedBatchUuid = fullCrateId.substring(0, lastDashIndex);
    const parsedCrateId = fullCrateId;

    try {
      const [historyData, auditData] = await Promise.all([
        getCrateHistory(parsedBatchUuid, parsedCrateId),
        getBatchHistoryAudit(parsedBatchUuid)
      ]);

      if (historyData && historyData.length > 0) {
        setPage('customer', { history: historyData, audit: auditData, batchUuid: fullCrateId });
      } else {
        setError('No history found for this crate');
      }
    } catch (err) {
      setError('Failed to fetch batch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.dropdown-menu')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div style={{ background: '#0a1f0a', minHeight: '100vh', height: '100vh', width: '100vw', color: 'white', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: 'auto' }}>
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

        {/* Dropdown Menu */}
        <div style={{ position: 'relative' }} className="dropdown-menu">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: '2px solid rgba(134, 239, 172, 0.3)',
              color: 'white',
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
              e.currentTarget.style.borderColor = 'white';
              e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
              e.currentTarget.style.background = 'none';
            }}
          >
            Menu
            <span style={{ 
              fontSize: '0.7rem',
              transition: 'transform 0.3s',
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              display: 'inline-block'
            }}>▼</span>
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              background: 'rgba(10, 31, 10, 0.98)',
              border: '1px solid rgba(134, 239, 172, 0.3)',
              borderRadius: '0.5rem',
              minWidth: '180px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              zIndex: 100
            }}>
              <button
                onClick={() => {
                  setPage('about');
                  setMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderBottom: '1px solid rgba(134, 239, 172, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'white';
                }}
              >
                About
              </button>
              <button
                onClick={() => {
                  setPage('process');
                  setMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderBottom: '1px solid rgba(134, 239, 172, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'white';
                }}
              >
                Process
              </button>
              <button
                onClick={() => {
                  setPage('producer');
                  setMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'white';
                }}
              >
                Producer Portal
              </button>
            </div>
          )}
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
        borderBottom: '1px solid rgba(134, 239, 172, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <AnimatedMapBackground />
        
        {/* Grid Pattern */}
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
            <span style={{ fontWeight: '600', color: 'white' }}>Trust the Chain.</span>
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
          
          {/* Search Box */}
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={batchUuid}
                onChange={(e) => {
                  setBatchUuid(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Batch ID to track (e.g., MOCK-FS-110825-A)"
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(134, 239, 172, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1.125rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = '#86efac';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
                }}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                style={{ 
                  padding: '1rem 2.5rem',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(134, 239, 172, 0.3)',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s',
                  letterSpacing: '0.01em',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = '#86efac';
                    e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Search size={20} strokeWidth={2.5} />
                {loading ? 'Searching...' : 'Track Batch'}
              </button>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem',
                color: '#fca5a5',
                fontSize: '0.9375rem',
                textAlign: 'left'
              }}>
                {error}
              </div>
            )}

            {/* Producer Portal Link */}
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => setPage('producer')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#86efac',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#d1fae5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#86efac';
                }}
              >
                Are you a producer? Click here to manage batches
              </button>
            </div>
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
            <div
              onClick={() => setPage('about', null, 'blockchain-security')}
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

            <div
              onClick={() => setPage('about', null, 'real-time-tracking')}
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

            <div
              onClick={() => setPage('about', null, 'consumer-trust')}
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
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            {[
              { num: 1, title: 'Register the Farm', desc: 'Producers create verified farm profiles, linking their identity and operations to the blockchain for trusted traceability.' },
              { num: 2, title: 'Create Batch', desc: 'New batches are logged with key details like harvest date and location, giving each product a unique digital identity.' },
              { num: 3, title: 'Quality & Certification', desc: 'Producers attach inspection results and certifications to each batch, ensuring every claim is verifiable and transparent.' },
              { num: 4, title: 'Record Transfers', desc: 'Every handoff in the supply chain is recorded and verified, creating a tamper-proof chain of custody from start to finish.' },
              { num: 5, title: 'Real-Time Tracking', desc: 'GPS data and timestamps update automatically, allowing everyone to monitor shipments and conditions in real time.' },
              { num: 6, title: 'Retail Verification', desc: 'Retailers instantly confirm product authenticity and sourcing by scanning the blockchain record upon delivery.' },
              { num: 7, title: 'Track & Verify', desc: 'Consumers scan a code to view the produce\'s complete verified journey, building confidence in its freshness and origin.' }
            ].map(step => (
              <div 
                key={step.num}
                onClick={() => setPage('steps', null, null, step.num)}
                style={{ textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
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
                  color: '#0a1f0a',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 20px rgba(134, 239, 172, 0.3)'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
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

export function ProducerPortal({ setPage }) {
  const [mode, setMode] = useState("create");
  const [formData, setFormData] = useState({
    batch_uuid: "",
    farm_name: "",
    harvest_date: "",
    quantity_kg: "",
    crate_count: "",
    crate_number: "",
    grade: "",
    produce: "",
    action: "harvest",
    latitude: "",
    longitude: "",
    crate_numbers_string: ""
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Automatically get GPS location on mount
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
        },
        (error) => {
          console.error('GPS Error:', error);
          setMessage({ 
            type: 'error', 
            text: 'Unable to get your location. Please enable location services in your browser.' 
          });
        }
      );
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Geolocation is not supported by your browser.' 
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleActionChange = (action) => {
    setFormData({
      ...formData,
      action: action,
    });
  };

  const handleSubmit = async () => {
    setMessage(null);
    setPdfUrl(null);

    if (mode === "create") {
      if (!formData.farm_name || !formData.harvest_date || !formData.quantity_kg || !formData.crate_count ||
          !formData.grade || !formData.produce || !formData.latitude || !formData.longitude) {
        setMessage({ type: "error", text: "Please fill in all fields" });
        return;
      }
    } else {
      if (!formData.batch_uuid || !formData.farm_name || !formData.crate_number || !formData.action || !formData.latitude || !formData.longitude) {
        setMessage({ type: "error", text: "Please fill in all fields" });
        return;
      }
    }

    setLoading(true);
    
    let result = null; 
    
    try {
      if (mode === "create") {
        const data = {
          farm_name: formData.farm_name,
          action: "harvest",
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          harvest_date: formData.harvest_date,
          quantity_kg: parseFloat(formData.quantity_kg),
          crate_count: parseFloat(formData.crate_count),
          crate_number: formData.crate_number,
          grade: formData.grade,
          produce: formData.produce,
          crate_numbers_string: formData.crate_numbers_string || null
        };

        result = await createBatch(data); 
        console.log("CREATED BATCH WITH ID:", result.batch_uuid);
        setMessage({
          type: "success",
          text: `Batch created successfully! ID: ${result.batch_uuid}`,
        });
        setPdfUrl(result.pdf_url);
      } else {
        const data = {
          batch_uuid: formData.batch_uuid,
          actor_name: formData.farm_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          crate_numbers_string: formData.crate_number || null
        };
        const result = await addTransfer(data);
        setMessage({
          type: "success",
          text: `Transfer added to batch ${formData.batch_uuid}`,
        });
      }
      
      if (mode === "create") {
        setFormData({
          batch_uuid: "",
          farm_name: "",
          harvest_date: "",
          quantity_kg: "",
          crate_count: "",
          crate_number: "",
          grade: "",
          produce: "",
          action: "harvest",
          latitude: "",
          longitude: "",
          crate_numbers_string: ""
        });
      } else {
        setFormData({
          batch_uuid: "",
          farm_name: "",
          harvest_date: "",
          quantity_kg: "",
          crate_count: "",
          crate_number: "",
          grade: "",
          produce: "",
          action: "harvest", 
          latitude: "",
          longitude: "",
          
        });
        setMode("create");
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Something went wrong. Please check the console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: '#0a1f0a', 
      height: '100vh',
      width: '100vw',
      color: 'white', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
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
        <button
          onClick={() => setPage('home')}
          style={{
            background: 'transparent',
            border: '2px solid rgba(134, 239, 172, 0.3)',
            color: 'white',
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
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Home
        </button>
      </header>

      {/* Main Content */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        overflow: 'auto',
        paddingTop: '6rem',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(134, 239, 172, 0.03) 1px, transparent 0)',
          backgroundSize: '48px 48px',
          opacity: 0.4
        }} />

        <div style={{ 
          position: 'relative',
          width: '100%',
          maxWidth: '700px',
          zIndex: 1,
          padding: '0 2rem'
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '300', 
              marginBottom: '0.75rem',
              lineHeight: '1.2',
              letterSpacing: '-0.01em',
              color: 'white'
            }}>
              Producer <span style={{ fontWeight: '600', color: '#86efac' }}>Portal</span>
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              color: '#d1fae5',
              fontWeight: '300',
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}>
              Create batches and record transfers in the supply chain
            </p>
          </div>

          {/* Mode Toggle */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => {
                setMode("create");
                setMessage(null);
                setFormData({
                  ...formData,
                  action: "harvest"
                });
              }}
              style={{
                padding: '0.875rem',
                background: mode === "create" ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: mode === "create" ? '#0a1f0a' : '#86efac',
                border: mode === "create" ? 'none' : '2px solid rgba(134, 239, 172, 0.3)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                if (mode !== "create") {
                  e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
                  e.currentTarget.style.borderColor = '#86efac';
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== "create") {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
                }
              }}
            >
              New Batch
            </button>
            <button
              onClick={() => {
                setMode("transfer");
                setMessage(null);
                setFormData({
                  ...formData,
                  action: "transfer"
                });
              }}
              style={{
                padding: '0.875rem',
                background: mode === "transfer" ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: mode === "transfer" ? '#0a1f0a' : '#86efac',
                border: mode === "transfer" ? 'none' : '2px solid rgba(134, 239, 172, 0.3)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                if (mode !== "transfer") {
                  e.currentTarget.style.background = 'rgba(134, 239, 172, 0.1)';
                  e.currentTarget.style.borderColor = '#86efac';
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== "transfer") {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.3)';
                }
              }}
            >
              Add Transfer
            </button>
          </div>

          {/* Message */}
          {message && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              background: message.type === 'success' ? 'rgba(134, 239, 172, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(134, 239, 172, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: message.type === 'success' ? '#86efac' : '#fca5a5',
              fontSize: '0.9375rem',
              fontWeight: '400'
            }}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          {/* PDF Download Link */}
          {pdfUrl && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'rgba(134, 239, 172, 0.1)',
              border: '1px solid rgba(134, 239, 172, 0.3)',
              borderRadius: '0.5rem',
              color: '#d1fae5',
              fontSize: '0.9375rem',
              fontWeight: '400',
              textAlign: 'center'
            }}>
              Download QR codes{' '}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#86efac',
                  fontWeight: '600',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                here
              </a>
            </div>
          )}

          {/* Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(134, 239, 172, 0.2)',
            borderRadius: '1rem',
            padding: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {mode === "transfer" && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#d1fae5',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em'
                  }}>
                    Batch UUID
                  </label>
                  <input
                    type="text"
                    name="batch_uuid"
                    placeholder="Enter existing batch ID"
                    value={formData.batch_uuid}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '2px solid rgba(134, 239, 172, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9375rem',
                      fontWeight: '300',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box',
                      letterSpacing: '0.01em'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.borderColor = '#86efac';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                    }}
                  />
                </div>
              )}

              {mode === "create" && (
                <>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      color: '#d1fae5',
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      letterSpacing: '0.01em'
                    }}>
                      Farm Name
                    </label>
                    <input
                      type="text"
                      name="farm_name"
                      placeholder="e.g., Sunny Valley Farm"
                      value={formData.farm_name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(134, 239, 172, 0.2)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box',
                        letterSpacing: '0.01em'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = '#86efac';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        color: '#d1fae5',
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        letterSpacing: '0.01em'
                      }}>
                        Harvest Date
                      </label>
                      <input
                        type="date"
                        name="harvest_date"
                        value={formData.harvest_date}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '2px solid rgba(134, 239, 172, 0.2)',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '0.9375rem',
                          fontWeight: '300',
                          outline: 'none',
                          transition: 'all 0.3s',
                          boxSizing: 'border-box',
                          letterSpacing: '0.01em',
                          colorScheme: 'dark'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.borderColor = '#86efac';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        color: '#d1fae5',
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        letterSpacing: '0.01em'
                      }}>
                        Quantity (kg)
                      </label>
                      <input
                        type="number"
                        name="quantity_kg"
                        placeholder="e.g., 500"
                        value={formData.quantity_kg}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '2px solid rgba(134, 239, 172, 0.2)',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '0.9375rem',
                          fontWeight: '300',
                          outline: 'none',
                          transition: 'all 0.3s',
                          boxSizing: 'border-box',
                          letterSpacing: '0.01em'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.borderColor = '#86efac';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        color: '#d1fae5',
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        letterSpacing: '0.01em'
                      }}>
                        Grade
                      </label>
                      <input
                        type="text"
                        name="grade"
                        placeholder="e.g., A, B, Premium"
                        value={formData.grade}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '2px solid rgba(134, 239, 172, 0.2)',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '0.9375rem',
                          fontWeight: '300',
                          outline: 'none',
                          transition: 'all 0.3s',
                          boxSizing: 'border-box',
                          letterSpacing: '0.01em'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.borderColor = '#86efac';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        color: '#d1fae5',
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        letterSpacing: '0.01em'
                      }}>
                        Produce
                      </label>
                      <input
                        type="text"
                        name="produce"
                        placeholder="e.g., Bananas, Apples"
                        value={formData.produce}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '2px solid rgba(134, 239, 172, 0.2)',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '0.9375rem',
                          fontWeight: '300',
                          outline: 'none',
                          transition: 'all 0.3s',
                          boxSizing: 'border-box',
                          letterSpacing: '0.01em'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.borderColor = '#86efac';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      color: '#d1fae5',
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      letterSpacing: '0.01em'
                    }}>
                      Crate Count
                    </label>
                    <input
                      type="number"
                      name="crate_count"
                      placeholder="e.g., 25"
                      value={formData.crate_count}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(134, 239, 172, 0.2)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box',
                        letterSpacing: '0.01em'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = '#86efac';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                      }}
                    />
                  </div>
                </>
              )}

              {mode === "transfer" && (
                <>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      color: '#d1fae5',
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      letterSpacing: '0.01em'
                    }}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="farm_name"
                      placeholder="e.g., Transport Co., Warehouse"
                      value={formData.farm_name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(134, 239, 172, 0.2)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box',
                        letterSpacing: '0.01em'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = '#86efac';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      color: '#d1fae5',
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      letterSpacing: '0.01em'
                    }}>
                      Crate Number
                    </label>
                    <input
                      type="text"
                      name="crate_number"
                      placeholder="e.g. 1, 2, 5-10"
                      value={formData.crate_number}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(134, 239, 172, 0.2)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box',
                        letterSpacing: '0.01em'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = '#86efac';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      color: '#d1fae5',
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      letterSpacing: '0.01em'
                    }}>
                      Action Type
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => handleActionChange('Arrived At Warehouse')}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: formData.action === 'transfer' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${formData.action === 'transfer' ? '#86efac' : 'rgba(134, 239, 172, 0.2)'}`,
                          borderRadius: '0.5rem',
                          color: formData.action === 'transfer' ? '#86efac' : '#a7f3d0',
                          fontSize: '0.9375rem',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          letterSpacing: '0.01em'
                        }}
                      >
                        Arrived At Warehouse
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActionChange('store')}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: formData.action === 'store' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${formData.action === 'store' ? '#86efac' : 'rgba(134, 239, 172, 0.2)'}`,
                          borderRadius: '0.5rem',
                          color: formData.action === 'store' ? '#86efac' : '#a7f3d0',
                          fontSize: '0.9375rem',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          letterSpacing: '0.01em'
                        }}
                      >
                        Arrived At Store
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* GPS Coordinates - Auto-detected */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#d1fae5',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em'
                  }}>
                    Latitude (Auto-detected)
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(134, 239, 172, 0.1)',
                      border: '2px solid rgba(134, 239, 172, 0.3)',
                      borderRadius: '0.5rem',
                      color: '#86efac',
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      outline: 'none',
                      boxSizing: 'border-box',
                      letterSpacing: '0.01em'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#d1fae5',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em'
                  }}>
                    Longitude (Auto-detected)
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(134, 239, 172, 0.1)',
                      border: '2px solid rgba(134, 239, 172, 0.3)',
                      borderRadius: '0.5rem',
                      color: '#86efac',
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      outline: 'none',
                      boxSizing: 'border-box',
                      letterSpacing: '0.01em'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '1rem',
                  background: loading
                    ? 'rgba(134, 239, 172, 0.3)'
                    : 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                  color: '#0a1f0a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  letterSpacing: '0.01em',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(134, 239, 172, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(134, 239, 172, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(134, 239, 172, 0.3)';
                }}
              >
                {loading ? 'Processing...' : mode === 'create' ? 'Create Batch' : 'Add Transfer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}