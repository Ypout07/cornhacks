// ============================================================================
// StepsPage.jsx
// ============================================================================
import { ArrowLeft, Package } from 'lucide-react';
import React, { useState } from 'react';

const stepsData = [
  {
    number: 1,
    title: "Register the Farm",
    shortDesc: "Producers create verified farm profiles, linking their identity and operations to the blockchain for trusted traceability.",
    fullDesc: "The process begins with producers registering their farm or facility on the platform. This step links their verified business identity to the blockchain, ensuring that all future activity is tied to an authenticated source. Once registered, the producer gains access to secure batch creation and tracking tools that maintain full transparency from the start."
  },
  {
    number: 2,
    title: "Create Batch",
    shortDesc: "New batches are logged with key details like harvest date and location, giving each product a unique digital identity.",
    fullDesc: "After registration, producers log new batches of produce, entering key details such as crop type, harvest date, and precise origin coordinates. This creates a permanent digital record on the blockchain, giving each batch a unique identity that can be traced throughout its entire lifecycle. No edits, no fakes—just a clean, verifiable starting point."
  },
  {
    number: 3,
    title: "Quality & Certification",
    shortDesc: "Producers attach inspection results and certifications to each batch, ensuring every claim is verifiable and transparent.",
    fullDesc: "Before leaving the farm, the batch can be updated with certifications, inspection results, or lab analyses. Whether it's organic verification, safety testing, or sustainability data, these documents are securely attached to the blockchain record. This ensures every claim is backed by verifiable proof, not marketing fluff."
  },
  {
    number: 4,
    title: "Record Transfers",
    shortDesc: "Every handoff in the supply chain is recorded and verified, creating a tamper-proof chain of custody from start to finish.",
    fullDesc: "As produce moves through the supply chain, each transfer—farmer to distributor, distributor to retailer—is logged in real time. Every handler verifies their role, and each transaction is permanently added to the blockchain. This transparent chain of custody prevents tampering, mislabeling, and data loss, creating an unbroken record of accountability."
  },
  {
    number: 5,
    title: "Real-Time Tracking",
    shortDesc: "GPS data and timestamps update automatically, allowing everyone to monitor shipments and conditions in real time.",
    fullDesc: "Throughout transit, GPS data and timestamps are continuously updated, allowing stakeholders to monitor progress in real time. Any deviations, delays, or environmental condition alerts are instantly visible. This visibility strengthens logistics efficiency and provides early warnings for potential issues, all while maintaining a verified audit trail."
  },
  {
    number: 6,
    title: "Retail Verification",
    shortDesc: "Retailers instantly confirm product authenticity and sourcing by scanning the blockchain record upon delivery.",
    fullDesc: "When the produce arrives at the point of sale, retailers can scan and verify the full blockchain history instantly. This ensures that the products they display are exactly what they claim to be—fresh, authentic, and sourced from the registered producer. It also allows retailers to highlight transparency as a selling point, building consumer confidence."
  },
  {
    number: 7,
    title: "Track & Verify",
    shortDesc: "Consumers scan a code to view the produce's complete verified journey, building confidence in its freshness and origin.",
    fullDesc: "Finally, customers can scan a simple code on the packaging to access the entire verified journey—from farm registration to delivery. They see where their food came from, how it was handled, and who stood behind it at every step. This open visibility transforms ordinary purchasing into informed trust, closing the loop between grower and consumer."
  }
];

export function StepsPage({ setPage, selectedStep }) {
  const [expandedStep, setExpandedStep] = useState(selectedStep || null);
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (selectedStep !== null) {
      setIsAnimating(true);
      setTimeout(() => {
        setExpandedStep(selectedStep);
        setIsAnimating(false);
      }, 300);
    }
  }, [selectedStep]);

  const handleStepClick = (stepNumber) => {
    setIsAnimating(true);
    setTimeout(() => {
      setExpandedStep(stepNumber);
      setIsAnimating(false);
    }, 300);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setExpandedStep(null);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div style={{ 
      background: '#0a1f0a', 
      minHeight: '100vh',
      height: '100vh',
      color: 'white', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'auto',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
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

      {/* Main Content */}
      {!expandedStep ? (
        // Mind Map View
        <div style={{
          paddingTop: '8rem',
          paddingBottom: '4rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(134, 239, 172, 0.03) 1px, transparent 0)',
            backgroundSize: '48px 48px',
            opacity: 0.4,
            pointerEvents: 'none'
          }} />

          <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '300', 
              marginBottom: '1rem',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: 'white'
            }}>
              How It <span style={{ fontWeight: '600', color: '#86efac' }}>Works</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#d1fae5',
              fontWeight: '300',
              lineHeight: '1.7'
            }}>
              Click any step to learn more
            </p>
          </div>

          {/* Mind Map - Spider Web Design */}
          <div style={{ 
            position: 'relative', 
            width: '600px', 
            height: '600px',
            marginBottom: '4rem'
          }}>
            {/* Center Hub */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0a1f0a',
              textAlign: 'center',
              padding: '1rem',
              zIndex: 10,
              boxShadow: '0 0 30px rgba(134, 239, 172, 0.5)'
            }}>
              Supply Chain
            </div>

            {/* Steps positioned around the center */}
            {stepsData.map((step, index) => {
              const angle = (index * 360 / stepsData.length) - 90; // Start from top
              const radian = (angle * Math.PI) / 180;
              const radius = 250;
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;

              return (
                <React.Fragment key={step.number}>
                  {/* Connection Line */}
                  <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    <line
                      x1="300"
                      y1="300"
                      x2={300 + x}
                      y2={300 + y}
                      stroke="rgba(134, 239, 172, 0.2)"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Step Node */}
                  <div
                    onClick={() => handleStepClick(step.number)}
                    style={{
                      position: 'absolute',
                      top: `calc(50% + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#0a1f0a',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      zIndex: 5,
                      border: '3px solid rgba(134, 239, 172, 0.3)',
                      boxShadow: '0 4px 20px rgba(134, 239, 172, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(134, 239, 172, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(134, 239, 172, 0.3)';
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Step Label */}
                  <div style={{
                    position: 'absolute',
                    top: `calc(50% + ${y * 1.35}px)`,
                    left: `calc(50% + ${x * 1.35}px)`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#86efac',
                    textAlign: 'center',
                    width: '120px',
                    pointerEvents: 'none',
                    zIndex: 5
                  }}>
                    {step.title}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Short Descriptions Below */}
          <div style={{ 
            maxWidth: '1200px', 
            width: '100%',
            padding: '0 3rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}>
              {stepsData.map((step) => (
                <div
                  key={step.number}
                  onClick={() => handleStepClick(step.number)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(134, 239, 172, 0.2)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(134, 239, 172, 0.05)';
                    e.currentTarget.style.borderColor = '#86efac';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(134, 239, 172, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#0a1f0a',
                    marginBottom: '1rem'
                  }}>
                    {step.number}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '0.75rem', 
                    color: 'white',
                    letterSpacing: '-0.01em'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9375rem', 
                    color: '#a7f3d0', 
                    lineHeight: '1.6',
                    fontWeight: '300'
                  }}>
                    {step.shortDesc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Expanded Step View
        <div style={{
          paddingTop: '8rem',
          paddingBottom: '4rem',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease'
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
            maxWidth: '900px', 
            width: '100%',
            padding: '0 3rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(134, 239, 172, 0.2)',
              borderRadius: '1.5rem',
              padding: '4rem',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  background: 'none',
                  border: '2px solid rgba(134, 239, 172, 0.3)',
                  color: '#86efac',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
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
                ×
              </button>

              {/* Step Number Badge */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: '700',
                color: '#0a1f0a',
                marginBottom: '2rem',
                boxShadow: '0 8px 30px rgba(134, 239, 172, 0.4)'
              }}>
                {expandedStep}
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '1.5rem',
                letterSpacing: '-0.01em'
              }}>
                {stepsData[expandedStep - 1].title}
              </h2>

              {/* Full Description */}
              <p style={{
                fontSize: '1.25rem',
                color: '#d1fae5',
                lineHeight: '1.8',
                fontWeight: '300',
                marginBottom: '3rem'
              }}>
                {stepsData[expandedStep - 1].fullDesc}
              </p>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {expandedStep > 1 && (
                  <button
                    onClick={() => handleStepClick(expandedStep - 1)}
                    style={{
                      background: 'none',
                      border: '2px solid rgba(134, 239, 172, 0.3)',
                      color: '#86efac',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
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
                    ← Previous Step
                  </button>
                )}
                {expandedStep < stepsData.length && (
                  <button
                    onClick={() => handleStepClick(expandedStep + 1)}
                    style={{
                      background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                      border: 'none',
                      color: '#0a1f0a',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 20px rgba(134, 239, 172, 0.3)'
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
                    Next Step →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}