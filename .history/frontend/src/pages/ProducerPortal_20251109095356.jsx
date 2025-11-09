import { AlertCircle, ArrowLeft, CheckCircle, Package, X } from "lucide-react";
import React, { useState } from "react";
import { addTransfer, createBatch } from '../apiService.js';

export function ProducerPortal({ setPage }) {
  const [mode, setMode] = useState("create");
  const [formData, setFormData] = useState({
    batch_uuid: "",
    farm_name: "",
    harvest_date: "",
    quantity_kg: "",
    crate_count: "",
    grade: "",
    produce: "",
    action: "harvest",
    latitude: "",
    longitude: "",
    temperature_celsius: "",
    condition: "",
    crate_numbers_string: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfFilename, setPdfFilename] = useState(null);

  // QR Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const scanIntervalRef = React.useRef(null);

  // GPS location on mount
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
    }
  }, []);

  // QR Scanner Functions
  const startScanner = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMessage({ 
          type: 'error', 
          text: 'Camera access not supported. Please use HTTPS or check browser compatibility.' 
        });
        return;
      }

      console.log('Requesting camera access...');
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        console.log('Got back camera stream:', stream);
      } catch (err) {
        console.log('Back camera failed, trying any camera...', err);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        console.log('Got front camera stream:', stream);
      }
      
      streamRef.current = stream;
      setShowScanner(true);
      
      // Wait for modal to render, then attach stream
      setTimeout(() => {
        if (videoRef.current && stream) {
          console.log('Attaching stream to video element');
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, playing...');
            videoRef.current.play().catch(err => {
              console.error('Play failed:', err);
              setMessage({ type: 'error', text: 'Failed to play video: ' + err.message });
            });
          };
        }
      }, 100);
      
      scanIntervalRef.current = setInterval(() => {
        if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const context = canvas.getContext('2d');
          
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }, 100);
    } catch (error) {
      console.error('Camera error:', error);
      let errorMsg = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMsg += 'Please allow camera permissions in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMsg += 'No camera found on your device.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMsg += 'Camera is already in use by another application.';
      } else if (error.name === 'NotSupportedError') {
        errorMsg += 'Camera access requires HTTPS.';
      } else {
        errorMsg += 'Error: ' + error.message;
      }
      
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const stopScanner = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setShowScanner(false);
  };

  React.useEffect(() => {
    return () => {
      stopScanner();
    };
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

  const handleDownload = () => {
    if (!pdfBase64 || !pdfFilename) return;

    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = pdfFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleSubmit = async () => {
    setMessage(null);
    setPdfBase64(null);
    setPdfFilename(null);

    if (mode === "create") {
      if (!formData.farm_name || !formData.harvest_date || !formData.quantity_kg || !formData.crate_count ||
          !formData.grade || !formData.produce || !formData.latitude || !formData.longitude) {
        setMessage({ type: "error", text: "Please fill in all fields" });
        return;
      }
    } else {
      if (!formData.batch_uuid || !formData.farm_name || !formData.action  || !formData.latitude || !formData.longitude) {
        setMessage({ type: "error", text: "Please fill in all fields for the transfer" });
        return;
      }
    }

    setLoading(true);
    
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
          produce: formData.produce,
        };

        const result = await createBatch(data); 
        setMessage({
          type: "success",
          text: `Batch created successfully! ID: ${result.batch_uuid}`,
        });
        
        setPdfBase64(result.pdf_base64);
        setPdfFilename(result.pdf_filename);
        
      } else {
        const data = {
          batch_uuid: formData.batch_uuid,
          actor_name: formData.farm_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          grade: formData.grade || null,
          crate_numbers_string: formData.crate_numbers_string || null,
        };

        const cleanedData = Object.fromEntries(
          Object.entries(data).filter(([_, v]) => v !== null && v !== "")
        );

        await addTransfer(cleanedData);
        setMessage({
          type: "success",
          text: `Transfer added to batch ${formData.batch_uuid}`,
        });
      }
      
      const resetFormData = {
          batch_uuid: "",
          farm_name: formData.farm_name,
          harvest_date: "",
          quantity_kg: "",
          crate_count: "",
          grade: "",
          produce: "",
          action: mode === "create" ? "harvest" : "transfer", 
          latitude: formData.latitude,
          longitude: formData.longitude,
          temperature_celsius: "",
          condition: "",
          crate_numbers_string: "",
      };

      if (mode === "create") {
        setFormData({...resetFormData, action: "harvest"});
      } else {
        setFormData({...resetFormData, action: "harvest"});
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

  const inputStyle = {
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
  };

  return (
    <div style={{ 
      background: '#0a1f0a', 
      minHeight: '100vh',
      width: '100vw',
      color: 'white', 
      fontFamily: "'Inter', sans-serif",
      position: 'relative'
    }}>
      <header style={{ 
        padding: '1.5rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(10, 31, 10, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={32} color="#86efac" />
          <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>BANANA BLOCKCHAIN</span>
        </div>
        <button
          onClick={() => setPage('home')}
          style={{
            background: 'none',
            border: '2px solid rgba(134, 239, 172, 0.3)',
            color: '#86efac',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </header>

      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '0.75rem' }}>
            Producer <span style={{ fontWeight: '600', color: '#86efac' }}>Portal</span>
          </h1>
          <p style={{ color: '#d1fae5' }}>
            Create batches and record transfers in the supply chain
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => {
              setMode("create");
              setMessage(null);
              setPdfBase64(null);
              setPdfFilename(null);
              setFormData(prev => ({ ...prev, action: "harvest" }));
            }}
            style={{
              padding: '0.875rem',
              background: mode === "create" ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' : 'rgba(255, 255, 255, 0.05)',
              color: mode === "create" ? '#0a1f0a' : '#86efac',
              border: mode === "create" ? 'none' : '2px solid rgba(134, 239, 172, 0.3)',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            New Batch
          </button>
          <button
            onClick={() => {
              setMode("transfer");
              setMessage(null);
              setPdfBase64(null);
              setPdfFilename(null);
              setFormData(prev => ({ ...prev, action: "transfer" }));
            }}
            style={{
              padding: '0.875rem',
              background: mode === "transfer" ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' : 'rgba(255, 255, 255, 0.05)',
              color: mode === "transfer" ? '#0a1f0a' : '#86efac',
              border: mode === "transfer" ? 'none' : '2px solid rgba(134, 239, 172, 0.3)',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add Transfer
          </button>
        </div>

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
            color: message.type === 'success' ? '#86efac' : '#fca5a5'
          }}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {pdfBase64 && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'rgba(134, 239, 172, 0.1)',
            border: '1px solid rgba(134, 239, 172, 0.3)',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            Download QR codes{' '}
            <button onClick={handleDownload} style={{ background: 'none', border: 'none', color: '#86efac', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>
              here ({pdfFilename})
            </button>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(134, 239, 172, 0.2)',
          borderRadius: '1rem',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mode === "transfer" && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>
                  Batch UUID
                </label>
                <input type="text" name="batch_uuid" placeholder="Enter existing batch ID" value={formData.batch_uuid} onChange={handleChange} style={inputStyle} />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>
                {mode === "create" ? "Farm Name" : "Actor/Company Name"}
              </label>
              <input type="text" name="farm_name" placeholder={mode === "create" ? "e.g., Sunny Valley Farm" : "e.g., Transport Co."} value={formData.farm_name} onChange={handleChange} style={inputStyle} />
            </div>

            {mode === "create" && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Harvest Date</label>
                    <input type="date" name="harvest_date" value={formData.harvest_date} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Quantity (kg)</label>
                    <input type="number" name="quantity_kg" placeholder="e.g., 500" value={formData.quantity_kg} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Grade</label>
                    <input type="text" name="grade" placeholder="e.g., A, B" value={formData.grade} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Produce</label>
                    <input type="text" name="produce" placeholder="e.g., Bananas" value={formData.produce} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Crate Count</label>
                  <input type="number" name="crate_count" placeholder="e.g., 25" value={formData.crate_count} onChange={handleChange} style={inputStyle} />
                </div>
              </>
            )}

{mode === "transfer" && (
  <>
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Crate Numbers</label>
      <input type="text" name="crate_numbers_string" placeholder="e.g., 101, 102, 105-110" value={formData.crate_numbers_string} onChange={handleChange} style={inputStyle} />
    </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', color: '#d1fae5', fontSize: '0.875rem' }}>Action Type</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => handleActionChange('transfer')} style={{
                      flex: 1, padding: '0.75rem',
                      background: formData.action === 'transfer' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formData.action === 'transfer' ? '#86efac' : 'rgba(134, 239, 172, 0.2)'}`,
                      borderRadius: '0.5rem', color: formData.action === 'transfer' ? '#86efac' : '#a7f3d0',
                      cursor: 'pointer'
                    }}>Transfer</button>
                    <button type="button" onClick={() => handleActionChange('store')} style={{
                      flex: 1, padding: '0.75rem',
                      background: formData.action === 'store' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formData.action === 'store' ? '#86efac' : 'rgba(134, 239, 172, 0.2)'}`,
                      borderRadius: '0.5rem', color: formData.action === 'store' ? '#86efac' : '#a7f3d0',
                      cursor: 'pointer'
                    }}>Store</button>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Latitude</label>
                <input type="text" name="latitude" placeholder="e.g., 40.7128" value={formData.latitude} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1fae5', fontSize: '0.875rem' }}>Longitude</label>
                <input type="text" name="longitude" placeholder="e.g., -74.0060" value={formData.longitude} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                marginTop: '1rem', width: '100%', padding: '1rem',
                background: loading ? 'rgba(134, 239, 172, 0.3)' : 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                color: '#0a1f0a', border: 'none', borderRadius: '0.5rem',
                fontSize: '1.125rem', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : mode === 'create' ? 'Create Batch' : 'Add Transfer'}
            </button>
          </div>
        </div>
      </div>

      {/* QR Scanner Button */}
      {mode === "transfer" && !showScanner && (
        <button
          onClick={startScanner}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
            border: 'none',
            borderRadius: '1rem',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(134, 239, 172, 0.4)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0a1f0a', textTransform: 'uppercase' }}>
            Scan QR
          </span>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="16" height="16" fill="#0a1f0a" rx="2"/>
            <rect x="8" y="8" width="8" height="8" fill="#86efac" rx="1"/>
            <rect x="28" y="4" width="16" height="16" fill="#0a1f0a" rx="2"/>
            <rect x="32" y="8" width="8" height="8" fill="#86efac" rx="1"/>
            <rect x="4" y="28" width="16" height="16" fill="#0a1f0a" rx="2"/>
            <rect x="8" y="32" width="8" height="8" fill="#86efac" rx="1"/>
            <rect x="28" y="28" width="4" height="4" fill="#0a1f0a"/>
            <rect x="34" y="28" width="4" height="4" fill="#0a1f0a"/>
            <rect x="40" y="28" width="4" height="4" fill="#0a1f0a"/>
          </svg>
        </button>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)', display: 'flex',
          flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', zIndex: 20000, padding: '2rem'
        }}>
          <button onClick={stopScanner} style={{
            position: 'absolute', top: '2rem', right: '2rem',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5', padding: '0.75rem 1rem',
            borderRadius: '0.5rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <X size={20} /> Close
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#86efac', marginBottom: '0.5rem' }}>
              Scan QR Code
            </h2>
            <p style={{ color: '#d1fae5' }}>
              Position the QR code within the camera view
            </p>
          </div>

          <div style={{
            position: 'relative', width: '100%', maxWidth: '500px',
            aspectRatio: '1', borderRadius: '1rem', overflow: 'hidden',
            border: '4px solid #86efac',
            boxShadow: '0 0 40px rgba(134, 239, 172, 0.3)'
          }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', width: '80%', height: '80%',
              border: '3px solid #86efac', borderRadius: '1rem',
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', top: '-3px', left: '-3px', width: '40px', height: '40px', borderTop: '6px solid #86efac', borderLeft: '6px solid #86efac', borderRadius: '0.5rem 0 0 0' }} />
              <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '40px', height: '40px', borderTop: '6px solid #86efac', borderRight: '6px solid #86efac', borderRadius: '0 0.5rem 0 0' }} />
              <div style={{ position: 'absolute', bottom: '-3px', left: '-3px', width: '40px', height: '40px', borderBottom: '6px solid #86efac', borderLeft: '6px solid #86efac', borderRadius: '0 0 0 0.5rem' }} />
              <div style={{ position: 'absolute', bottom: '-3px', right: '-3px', width: '40px', height: '40px', borderBottom: '6px solid #86efac', borderRight: '6px solid #86efac', borderRadius: '0 0 0.5rem 0' }} />
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
}