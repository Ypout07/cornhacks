// ============================================================================
// ProducerPortal.jsx
// ============================================================================
import { AlertCircle, ArrowLeft, CheckCircle, Package } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { addTransfer, createBatch } from '../apiService';


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
  const mountRef = useRef(null);

  // Globe setup
  useEffect(() => {
    if (!mountRef.current) return;

    let globeRef = null;
    let atmosphereRef = null;
    let globeGroup = null;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let activePointerId = null;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      
      const camera = new THREE.PerspectiveCamera(
        45,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 350;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setClearColor(0x0a1f0a, 1);
      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.style.userSelect = 'none';
      renderer.domElement.style.pointerEvents = 'none'; // Don't block form interactions
      mountRef.current.appendChild(renderer.domElement);

      // Create group that will be rotated
      globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // Load texture for the globe
      const textureLoader = new THREE.TextureLoader();
      const earthTexture = textureLoader.load(
        'https://raw.githubusercontent.com/trevorhobenshield/earth-textures/main/earthmap4k.jpg',
        () => {
          console.log('Earth texture loaded');
        },
        undefined,
        (err) => {
          console.warn('Failed to load earth texture, falling back to solid color', err);
        }
      );

      // Create Earth globe (textured)
      // Create Earth globe (textured)
      const geometry = new THREE.SphereGeometry(150, 100, 100);
      
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 10,
        opacity: 0.95,
        transparent: true,
        color: '0xffffff'
      });

      const globe = new THREE.Mesh(geometry, earthMaterial);
      globeRef = globe;
      globeGroup.add(globe);

      // Add atmosphere glow
      const atmosphereGeometry = new THREE.SphereGeometry(150, 64, 64);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0) * intensity * 0.7;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphereRef = atmosphere;
      globeGroup.add(atmosphere);

      // Convert lat/lng to 3D coordinates on sphere
      const latLngToVector3 = (lat, lng, radius) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        return new THREE.Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };

      // Load and render country borders
      fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(geojson => {
          console.log('GeoJSON loaded, rendering borders...');
          
          const borderMaterial = new THREE.LineBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.9,
            linewidth: 3
          });

          geojson.features.forEach(feature => {
            const { geometry } = feature;
            
            if (geometry.type === 'Polygon') {
              geometry.coordinates.forEach(ring => {
                const points = ring.map(coord => 
                  latLngToVector3(coord[1], coord[0], 150.5)
                );
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, borderMaterial);
                globeGroup.add(line);
              });
            } else if (geometry.type === 'MultiPolygon') {
              geometry.coordinates.forEach(polygon => {
                polygon.forEach(ring => {
                  const points = ring.map(coord => 
                    latLngToVector3(coord[1], coord[0], 150.5)
                  );
                  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                  const line = new THREE.Line(lineGeometry, borderMaterial);
                  globeGroup.add(line);
                });
              });
            }
          });
          
          console.log('Country borders rendered!');
        })
        .catch(err => {
          console.warn('Failed to load country borders:', err);
        });

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        rotation.x += (targetRotation.x - rotation.x) * 0.12;
        rotation.y += (targetRotation.y - rotation.y) * 0.12;
        
        if (globeGroup) {
          globeGroup.rotation.x = rotation.x;
          globeGroup.rotation.y = rotation.y;
        }
        
        // Auto-rotate slowly
        targetRotation.y += 0.001;
        
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (mountRef.current) {
          camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        console.log('Cleaning up globe...');
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        try {
          geometry.dispose();
          earthMaterial.dispose();
          atmosphereGeometry.dispose();
          atmosphereMaterial.dispose();
          if (earthTexture && earthTexture.dispose) earthTexture.dispose();
        } catch (err) {}
      };
    } catch (error) {
      console.error('Globe error:', error);
    }
  }, []);

  // Automatically get GPS location on mount
  useEffect(() => {
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
      {/* Background Globe */}
      <div 
        ref={mountRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.9
        }}
      />

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
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', letterSpacing: '0.05em', fontFamily: "'Inter', sans-serif" }}>BANANA BLOCKCHAIN</span>
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
            letterSpacing: '0.01em',
            fontFamily: "'Inter', sans-serif"
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
        zIndex: 1
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(134, 239, 172, 0.03) 1px, transparent 0)',
          backgroundSize: '48px 48px',
          opacity: 0.4,
          zIndex: 0
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
                fontSize: '0.9375rem',
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
                fontSize: '0.9375rem',
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
              background: message.type === 'success' ? 'rgba(134, 239, 172, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${message.type === 'success' ? 'rgba(134, 239, 172, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: message.type === 'success' ? '#86efac' : '#fca5a5',
              fontSize: '0.9375rem',
              fontWeight: '400',
              backdropFilter: 'blur(10px)'
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
              background: 'rgba(134, 239, 172, 0.15)',
              border: '1px solid rgba(134, 239, 172, 0.4)',
              borderRadius: '0.5rem',
              color: '#d1fae5',
              fontSize: '0.9375rem',
              fontWeight: '400',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
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

          {/* Form - NO OUTLINE */}
          <div style={{
            padding: '2rem',
            backdropFilter: 'blur(20px)',
            background: 'rgba(10, 31, 10, 0.6)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {mode === "transfer" && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#d1fae5',
                    fontSize: '0.9375rem',
                    fontWeight: '400',
                    letterSpacing: '0.02em'
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
                      fontSize: '0.9375rem',
                      fontWeight: '400',
                      letterSpacing: '0.02em'
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
                        letterSpacing: '0.01em',
                        
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
                        fontWeight: '400',
                        letterSpacing: '0.02em'
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
                          colorScheme: 'dark',
                          
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
                        fontWeight: '400',
                        letterSpacing: '0.02em'
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
                          letterSpacing: '0.01em',
                          
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
                        fontSize: '0.9375rem',
                        fontWeight: '400',
                        letterSpacing: '0.02em'
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
                          letterSpacing: '0.01em',
                          
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
                        fontWeight: '400',
                        letterSpacing: '0.02em'
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
                          letterSpacing: '0.01em',
                          
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
                      fontSize: '0.9375rem',
                      fontWeight: '400',
                      letterSpacing: '0.02em'
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
                        letterSpacing: '0.01em',
                        
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
                      fontSize: '0.9375rem',
                      fontWeight: '400',
                      letterSpacing: '0.02em'
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
                        letterSpacing: '0.01em',
                        
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
                      fontWeight: '400',
                      letterSpacing: '0.02em'
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
                        letterSpacing: '0.01em',
                        
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
                      fontSize: '0.9375rem',
                      fontWeight: '400',
                      letterSpacing: '0.02em'
                    }}>
                      Action Type
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => handleActionChange('Arrived At Warehouse')}
                        style={{
                          flex: 1,
                          padding: '0.875rem',
                          background: formData.action === 'transfer' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${formData.action === 'transfer' ? '#86efac' : 'rgba(134, 239, 172, 0.2)'}`,
                          borderRadius: '0.5rem',
                          color: formData.action === 'transfer' ? '#86efac' : '#a7f3d0',
                          fontSize: '0.9375rem',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          letterSpacing: '0.01em',
                          
                        }}
                      >
                        Arrived At Warehouse
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActionChange('store')}
                        style={{
                          flex: 1,
                          padding: '0.875rem',
                          background: formData.action === 'store' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${formData.action === 'store' ? '#86efac' : 'rgba(134, 239, 172, 0.2)'}`,
                          borderRadius: '0.5rem',
                          color: formData.action === 'store' ? '#86efac' : '#a7f3d0',
                          fontSize: '0.9375rem',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          letterSpacing: '0.01em',
                          
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
                    fontSize: '0.9375rem',
                    fontWeight: '400',
                    letterSpacing: '0.02em'
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
                      letterSpacing: '0.01em',
                      
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#d1fae5',
                    fontSize: '0.9375rem',
                    fontWeight: '400',
                    letterSpacing: '0.02em'
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
                      letterSpacing: '0.01em',
                      
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