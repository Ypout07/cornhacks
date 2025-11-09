// ============================================================================
// GlobeJourneyView.jsx - 3D Globe Journey Visualization
// ============================================================================
import { ArrowLeft, Package } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function GlobeJourneyView({ setPage, batchData }) {
  const mountRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log('Globe initializing...');

    try {
      // Scene setup
      const scene = new THREE.Scene();
      
      const camera = new THREE.PerspectiveCamera(
        45,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 300;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setClearColor(0x0a1f0a, 1);
      mountRef.current.appendChild(renderer.domElement);

      // Create Earth globe
      const geometry = new THREE.SphereGeometry(100, 64, 64);
      
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2d5a3d,
        emissive: 0x112211,
        shininess: 10
      });

      const globe = new THREE.Mesh(geometry, earthMaterial);
      scene.add(globe);

      // Add atmosphere glow
      const atmosphereGeometry = new THREE.SphereGeometry(102, 64, 64);
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
            gl_FragColor = vec4(0.53, 0.94, 0.67, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      // Sample journey data
      const journeyPoints = [
        { latitude: 10.3157, longitude: -84.2189, action: 'Harvested', actor_name: 'Green Valley Farm' },
        { latitude: 9.9281, longitude: -84.0907, action: 'Processed', actor_name: 'Processing Center' },
        { latitude: 25.7617, longitude: -80.1918, action: 'Shipped', actor_name: 'Miami Port' },
        { latitude: 40.7128, longitude: -74.0060, action: 'Received', actor_name: 'NYC Distribution' }
      ];

      // Convert lat/lng to 3D coordinates
      const latLngToVector3 = (lat, lng, radius) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        return new THREE.Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };

      // Create journey points
      const pointsMaterial = new THREE.MeshBasicMaterial({ color: 0x86efac });
      const linePoints = [];

      journeyPoints.forEach((point) => {
        const position = latLngToVector3(point.latitude, point.longitude, 101);
        
        const pointGeometry = new THREE.SphereGeometry(2, 16, 16);
        const pointMesh = new THREE.Mesh(pointGeometry, pointsMaterial);
        pointMesh.position.copy(position);
        scene.add(pointMesh);

        linePoints.push(position);
      });

      // Create paths between points
      for (let i = 0; i < linePoints.length - 1; i++) {
        const start = linePoints[i];
        const end = linePoints[i + 1];
        
        const distance = start.distanceTo(end);
        const midPoint = start.clone().add(end).multiplyScalar(0.5);
        midPoint.normalize().multiplyScalar(101 + distance * 0.3);
        
        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
        const points = curve.getPoints(50);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x86efac,
          transparent: true,
          opacity: 0.6
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      // Mouse interaction variables
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let currentRotation = { x: 0, y: 0 };

      const onMouseDown = (e) => {
        console.log('Mouse down detected');
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      };

      const onMouseMove = (e) => {
        if (isDragging) {
          console.log('Dragging...');
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;
          
          currentRotation.y += deltaX * 0.01;
          currentRotation.x += deltaY * 0.01;
          
          // Limit vertical rotation
          currentRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, currentRotation.x));
          
          globe.rotation.y = currentRotation.y;
          globe.rotation.x = currentRotation.x;
          atmosphere.rotation.y = currentRotation.y;
          atmosphere.rotation.x = currentRotation.x;
          
          previousMousePosition = { x: e.clientX, y: e.clientY };
          e.preventDefault();
        }
      };

      const onMouseUp = (e) => {
        console.log('Mouse up detected');
        isDragging = false;
        e.preventDefault();
      };

      // Add event listeners
      console.log('Adding event listeners to canvas');
      renderer.domElement.addEventListener('mousedown', onMouseDown, false);
      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('mouseup', onMouseUp, false);
      renderer.domElement.style.cursor = 'grab';

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (!isDragging) {
          // Slow auto-rotation when not dragging
          currentRotation.y += 0.001;
          globe.rotation.y = currentRotation.y;
          atmosphere.rotation.y = currentRotation.y;
        }
        
        renderer.render(scene, camera);
      };
      animate();

      setIsLoading(false);
      console.log('Globe loaded successfully!');

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
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        earthMaterial.dispose();
        atmosphereGeometry.dispose();
        atmosphereMaterial.dispose();
      };
    } catch (error) {
      console.error('Globe error:', error);
      setIsLoading(false);
    }
  }, [batchData]);

  const journeyData = [
    { latitude: 10.3157, longitude: -84.2189, action: 'Harvested', actor_name: 'Green Valley Farm', timestamp: new Date().toISOString() },
    { latitude: 9.9281, longitude: -84.0907, action: 'Processed', actor_name: 'Processing Center', timestamp: new Date().toISOString() },
    { latitude: 25.7617, longitude: -80.1918, action: 'Shipped', actor_name: 'Miami Port', timestamp: new Date().toISOString() },
    { latitude: 40.7128, longitude: -74.0060, action: 'Received', actor_name: 'NYC Distribution', timestamp: new Date().toISOString() }
  ];

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
      <div style={{ 
        position: 'absolute',
        top: '5rem',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#86efac',
            fontSize: '1.5rem',
            fontWeight: '300',
            zIndex: 100
          }}>
            Loading Globe...
          </div>
        )}

        {/* Globe Container */}
        <div style={{ 
          flex: 1,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div 
            ref={mountRef} 
            style={{ 
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0a1f0a 0%, #14532d 50%, #0a1f0a 100%)',
              touchAction: 'none'
            }}
          />

          {/* Controls Hint */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(134, 239, 172, 0.1)',
            border: '1px solid rgba(134, 239, 172, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            color: '#d1fae5',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            Click and drag to rotate
          </div>
        </div>

        {/* Journey Timeline Sidebar */}
        <div style={{
          width: '400px',
          flexShrink: 0,
          background: 'rgba(10, 31, 10, 0.95)',
          borderLeft: '1px solid rgba(134, 239, 172, 0.2)',
          overflowY: 'auto',
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '300', 
            marginBottom: '0.5rem',
            color: 'white',
            letterSpacing: '-0.01em'
          }}>
            Batch <span style={{ fontWeight: '600', color: '#86efac' }}>Journey</span>
          </h2>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#a7f3d0', 
            marginBottom: '2rem',
            fontWeight: '300'
          }}>
            {journeyData.length} stops • Verified on blockchain
          </p>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(180deg, #86efac 0%, rgba(134, 239, 172, 0.3) 100%)'
            }} />

            {journeyData.map((point, index) => (
              <div 
                key={index}
                style={{
                  position: 'relative',
                  paddingLeft: '3rem',
                  paddingBottom: '2rem',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPoint(index)}
              >
                <div style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '0',
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  background: index === 0 || index === journeyData.length - 1 
                    ? 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' 
                    : 'rgba(134, 239, 172, 0.5)',
                  border: '2px solid #0a1f0a',
                  boxShadow: '0 0 10px rgba(134, 239, 172, 0.5)',
                  zIndex: 2
                }} />

                <div style={{
                  background: selectedPoint === index 
                    ? 'rgba(134, 239, 172, 0.1)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: selectedPoint === index
                    ? '1px solid #86efac'
                    : '1px solid rgba(134, 239, 172, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#86efac',
                    marginBottom: '0.25rem',
                    letterSpacing: '-0.01em'
                  }}>
                    {point.action}
                  </div>
                  <div style={{ 
                    fontSize: '0.9375rem', 
                    color: '#d1fae5',
                    marginBottom: '0.5rem',
                    fontWeight: '300'
                  }}>
                    {point.actor_name}
                  </div>
                  <div style={{ 
                    fontSize: '0.8125rem', 
                    color: '#a7f3d0',
                    fontWeight: '300'
                  }}>
                    {point.latitude.toFixed(4)}°, {point.longitude.toFixed(4)}°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}