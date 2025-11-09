// ============================================================================
// LogisticsPortal.jsx
// ============================================================================
import { Package, Search, Shield, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import { getBatchHistory, getBatchHistoryAudit } from '../apiService';

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

  const handleSearch = async () => {
    if (!batchUuid.trim()) {
      setError('Please enter a batch UUID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [historyData, auditData] = await Promise.all([
        getBatchHistory(batchUuid),
        getBatchHistoryAudit(batchUuid)
      ]);

      if (historyData && historyData.length > 0) {
        setPage('customer', { history: historyData, audit: auditData, batchUuid });
      } else {
        setError('No batch found with this UUID');
      }
    } catch (err) {
      setError('Failed to fetch batch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => setPage('about')}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', justifyItems: 'center' }}>
            {/* Step 1 */}
            <div 
              onClick={() => setPage('steps', null, null, 1)}
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
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Register the Farm</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Producers create verified farm profiles, linking their identity and operations to the blockchain for trusted traceability.
              </p>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => setPage('steps', null, null, 2)}
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
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Create Batch</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                New batches are logged with key details like harvest date and location, giving each product a unique digital identity.
              </p>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => setPage('steps', null, null, 3)}
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
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Quality & Certification</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Producers attach inspection results and certifications to each batch, ensuring every claim is verifiable and transparent.
              </p>
            </div>

            {/* Step 4 */}
            <div 
              onClick={() => setPage('steps', null, null, 4)}
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
                4
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Record Transfers</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Every handoff in the supply chain is recorded and verified, creating a tamper-proof chain of custody from start to finish.
              </p>
            </div>

            {/* Step 5 */}
            <div 
              onClick={() => setPage('steps', null, null, 5)}
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
                5
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Real-Time Tracking</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                GPS data and timestamps update automatically, allowing everyone to monitor shipments and conditions in real time.
              </p>
            </div>

            {/* Step 6 */}
            <div 
              onClick={() => setPage('steps', null, null, 6)}
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
                6
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Retail Verification</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Retailers instantly confirm product authenticity and sourcing by scanning the blockchain record upon delivery.
              </p>
            </div>

            {/* Step 7 */}
            <div 
              onClick={() => setPage('steps', null, null, 7)}
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
                7
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.01em' }}>Track & Verify</h3>
              <p style={{ fontSize: '0.9375rem', color: '#a7f3d0', lineHeight: '1.5', fontWeight: '300' }}>
                Consumers scan a code to view the produce's complete verified journey, building confidence in its freshness and origin.
              </p>
            </div>
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