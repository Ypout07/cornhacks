// ============================================================================
// ProducerPortal.jsx
// ============================================================================
import { AlertCircle, ArrowLeft, CheckCircle, Package, Plus } from "lucide-react";
import React, { useState } from "react";
import { addTransfer, createBatch } from '../apiService';

export function ProducerPortal({ setPage }) {
  const [mode, setMode] = useState("create");
  const [formData, setFormData] = useState({
    batch_uuid: "",
    actor_name: "",
    action: "",
    latitude: "",
    longitude: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (
      (mode === "create" &&
        (!formData.actor_name ||
          !formData.action ||
          !formData.latitude ||
          !formData.longitude)) ||
      (mode === "transfer" &&
        (!formData.batch_uuid ||
          !formData.actor_name ||
          !formData.action ||
          !formData.latitude ||
          !formData.longitude))
    ) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        const data = {
          actor_name: formData.actor_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        };
        const result = await createBatch(data);
        setMessage({
          type: "success",
          text: `Batch created successfully! ID: ${result.batch_uuid}`,
        });
      } else {
        const data = {
          batch_uuid: formData.batch_uuid,
          actor_name: formData.actor_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        };
        const result = await addTransfer(data);
        setMessage({
          type: "success",
          text: `Transfer added to batch ${result.batch_uuid}`,
        });
      }
      
      // Clear form on success
      setFormData({
        batch_uuid: "",
        actor_name: "",
        action: "",
        latitude: "",
        longitude: "",
      });
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
        <button
          onClick={() => setPage('home')}
          style={{
            background: 'none',
            border: '2px solid rgba(134, 239, 172, 0.3)',
            color: '#86efac',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.9375rem',
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
          <ArrowLeft size={18} strokeWidth={2} />
          Back to Home
        </button>
      </header>

      {/* Main Content */}
      <section style={{ 
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1f0a 0%, #14532d 50%, #0a1f0a 100%)',
        padding: '8rem 2rem 4rem'
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
          zIndex: 1
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '300', 
              marginBottom: '1rem',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: 'white'
            }}>
              Producer <span style={{ fontWeight: '600', color: '#86efac' }}>Portal</span>
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#d1fae5',
              fontWeight: '300',
              lineHeight: '1.6'
            }}>
              Create batches and record transfers in the supply chain
            </p>
          </div>

          {/* Mode Toggle */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <button
              onClick={() => {
                setMode("create");
                setMessage(null);
              }}
              style={{
                padding: '1rem',
                background: mode === "create" ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: mode === "create" ? '#0a1f0a' : '#86efac',
                border: mode === "create" ? 'none' : '2px solid rgba(134, 239, 172, 0.3)',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
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
              }}
              style={{
                padding: '1rem',
                background: mode === "transfer" ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: mode === "transfer" ? '#0a1f0a' : '#86efac',
                border: mode === "transfer" ? 'none' : '2px solid rgba(134, 239, 172, 0.3)',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
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

          {/* Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(134, 239, 172, 0.2)',
            borderRadius: '1rem',
            padding: '2.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {mode === "transfer" && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#d1fae5',
                    fontSize: '0.9375rem',
                    fontWeight: '500',
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
                      padding: '0.875rem 1.25rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '2px solid rgba(134, 239, 172, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
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

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#d1fae5',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  letterSpacing: '0.01em'
                }}>
                  Actor Name
                </label>
                <input
                  type="text"
                  name="actor_name"
                  placeholder="e.g., Farm Sunrise, Transport Co."
                  value={formData.actor_name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(134, 239, 172, 0.2)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
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
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  letterSpacing: '0.01em'
                }}>
                  Action
                </label>
                <input
                  type="text"
                  name="action"
                  placeholder="e.g., Harvested, Shipped, Stored"
                  value={formData.action}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(134, 239, 172, 0.2)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
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
                    fontSize: '0.9375rem',
                    fontWeight: '500',
                    letterSpacing: '0.01em'
                  }}>
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    placeholder="e.g., 40.7128"
                    value={formData.latitude}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1.25rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '2px solid rgba(134, 239, 172, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
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
                    fontSize: '0.9375rem',
                    fontWeight: '500',
                    letterSpacing: '0.01em'
                  }}>
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    placeholder="e.g., -74.0060"
                    value={formData.longitude}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1.25rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '2px solid rgba(134, 239, 172, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
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

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  marginTop: '1rem',
                  padding: '1rem 2rem',
                  background: loading ? 'rgba(134, 239, 172, 0.5)' : 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                  color: '#0a1f0a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s',
                  letterSpacing: '0.01em',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(134, 239, 172, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : mode === "create" ? (
                  <>
                    <Plus size={20} strokeWidth={2.5} />
                    <span>Create Batch</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} strokeWidth={2.5} />
                    <span>Add Transfer</span>
                  </>
                )}
              </button>

              {message && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '1rem 1.25rem',
                  background: message.type === "success" ? 'rgba(134, 239, 172, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${message.type === "success" ? 'rgba(134, 239, 172, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '0.5rem',
                  color: message.type === "success" ? '#86efac' : '#fca5a5',
                  fontSize: '0.9375rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  {message.type === "success" ? (
                    <CheckCircle size={20} strokeWidth={2} />
                  ) : (
                    <AlertCircle size={20} strokeWidth={2} />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
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