// src/components/3d/ProcureMindScene.jsx
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Node Definitions representing the exact requested pipeline topology:
//                  MARKET DATA (Top)
//                       |
// VENDORS (Left) → AI PROCUREMENT INTELLIGENCE (Center) ← EXPENSES (Right)
//                       |
//                  PROCUREMENT (Mid-Bottom)
//                       |
//               COMPANY BEHAVIOR (Bottom)
const NODES = [
  {
    id: 'market-data',
    name: 'Market Data',
    category: 'EXTERNAL INTELLIGENCE',
    position: [0, 2.5, 0.2],
    color: '#06B6D4',
    glowColor: '#22D3EE',
    type: 'top-input',
    stat: 'Global Indices Live',
    shape: 'tetrahedron',
  },
  {
    id: 'vendors',
    name: 'Vendors',
    category: 'SUPPLY BASE',
    position: [-3.6, 0, 0.3],
    color: '#818CF8',
    glowColor: '#A5B4FC',
    type: 'left-input',
    stat: '142 Active Rates',
    shape: 'octahedron',
  },
  {
    id: 'expenses',
    name: 'Expenses',
    category: 'DATA INGESTION',
    position: [3.6, 0, 0.3],
    color: '#10B981',
    glowColor: '#34D399',
    type: 'right-input',
    stat: '₹50.4L Monitored',
    shape: 'octahedron',
  },
  {
    id: 'procurement',
    name: 'Procurement',
    category: 'DECISION HUB',
    position: [0, -1.8, 0.3],
    color: '#3B82F6',
    glowColor: '#60A5FA',
    type: 'decision',
    stat: '12 Decisions Queued',
    shape: 'icosahedron',
  },
  {
    id: 'company-behavior',
    name: 'Company Behavior',
    category: 'HISTORICAL PATTERNS',
    position: [0, -3.3, 0.2],
    color: '#EC4899',
    glowColor: '#F472B6',
    type: 'context',
    stat: '98.4% Policy Adherence',
    shape: 'tetrahedron',
  },
];

// Central Floating AI Intelligence Core Component
function CentralAiCore({ isHovered, onHover }) {
  const outerGroupRef = useRef();
  const innerCoreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y = t * 0.25;
      outerGroupRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.4;
      innerCoreRef.current.rotation.z = Math.cos(t * 0.3) * 0.12;
      const scale = 1 + Math.sin(t * 2) * 0.04;
      innerCoreRef.current.scale.set(scale, scale, scale);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4;
      ring1Ref.current.rotation.y = t * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.35;
      ring2Ref.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group
      ref={outerGroupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      {/* Glowing Inner Core */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#1D4ED8"
          emissive="#3B82F6"
          emissiveIntensity={isHovered ? 2.6 : 1.5}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Crystalline Wireframe Cage */}
      <mesh>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial
          color="#60A5FA"
          emissive="#2563EB"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Outer Octahedron Shield */}
      <mesh>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#93C5FD"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Orbital Energy Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.7, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#60A5FA"
          emissive="#60A5FA"
          emissiveIntensity={1.2}
          transparent
          opacity={0.65}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.9, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#818CF8"
          emissive="#818CF8"
          emissiveIntensity={1.0}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Core HTML Label */}
      <Html
        center
        distanceFactor={10}
        position={[0, 0, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className="scene-ai-core-badge">
          <div className="scene-ai-core-dot" />
          <span className="scene-ai-core-text">AI PROCUREMENT INTELLIGENCE</span>
        </div>
      </Html>
    </group>
  );
}

// Single Floating Node Component
function IntelligenceNode({ node, activeNodeId, onSelectNode }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const isSelected = activeNodeId === node.id;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() + (node.position[0] * 1.5) + (node.position[1] * 0.8);
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = t * 0.2;
      // Gentle floating motion
      meshRef.current.position.y = node.position[1] + Math.sin(t * 1.6) * 0.1;
    }
  });

  const renderGeometry = () => {
    switch (node.shape) {
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.38, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.36, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.42, 1]} />;
      case 'octahedron':
      default:
        return <octahedronGeometry args={[0.38, 0]} />;
    }
  };

  return (
    <group position={[node.position[0], 0, node.position[2]]}>
      <mesh
        ref={meshRef}
        position={[0, node.position[1], 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node.id);
        }}
        scale={hovered || isSelected ? 1.3 : 1.0}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={node.color}
          emissive={node.glowColor}
          emissiveIntensity={hovered || isSelected ? 1.8 : 0.85}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Wireframe Halo for Selected/Hovered Node */}
      {(hovered || isSelected) && (
        <mesh position={[0, node.position[1], 0]} scale={1.7}>
          {renderGeometry()}
          <meshBasicMaterial
            color={node.glowColor}
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>
      )}

      {/* Floating 2D HTML Label */}
      <Html
        center
        distanceFactor={11}
        position={[0, node.position[1] + (node.position[1] < 0 ? -0.55 : 0.6), 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className={`scene-node-tag ${hovered || isSelected ? 'active' : ''}`}>
          <div
            className="scene-node-dot"
            style={{ backgroundColor: node.glowColor }}
          />
          <div className="scene-node-label-col">
            <span className="scene-node-title">{node.name}</span>
            <span className="scene-node-stat">{node.stat}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Energy Packet Pulse traversing along connecting lines
function EnergyPulse({ start, end, speed = 1, color = '#60A5FA' }) {
  const ref = useRef();
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() * speed) % 1;
      ref.current.position.lerpVectors(startVec, endVec, t);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Connecting Lines and Neural Links according to requested topology
function ConnectionLines({ nodes }) {
  const centralPoint = [0, 0, 0];
  const marketNode = nodes.find((n) => n.id === 'market-data');
  const vendorNode = nodes.find((n) => n.id === 'vendors');
  const expenseNode = nodes.find((n) => n.id === 'expenses');
  const procurementNode = nodes.find((n) => n.id === 'procurement');
  const companyNode = nodes.find((n) => n.id === 'company-behavior');

  return (
    <group>
      {/* 1. Market Data (Top) -> AI Core */}
      {marketNode && (
        <>
          <Line
            points={[marketNode.position, centralPoint]}
            color={marketNode.glowColor}
            lineWidth={1.6}
            transparent
            opacity={0.6}
          />
          <EnergyPulse start={marketNode.position} end={centralPoint} speed={0.9} color={marketNode.glowColor} />
        </>
      )}

      {/* 2. Vendors (Left) -> AI Core */}
      {vendorNode && (
        <>
          <Line
            points={[vendorNode.position, centralPoint]}
            color={vendorNode.glowColor}
            lineWidth={1.6}
            transparent
            opacity={0.6}
          />
          <EnergyPulse start={vendorNode.position} end={centralPoint} speed={0.85} color={vendorNode.glowColor} />
        </>
      )}

      {/* 3. Expenses (Right) -> AI Core */}
      {expenseNode && (
        <>
          <Line
            points={[expenseNode.position, centralPoint]}
            color={expenseNode.glowColor}
            lineWidth={1.6}
            transparent
            opacity={0.6}
          />
          <EnergyPulse start={expenseNode.position} end={centralPoint} speed={0.85} color={expenseNode.glowColor} />
        </>
      )}

      {/* 4. AI Core -> Procurement (Mid-Bottom) */}
      {procurementNode && (
        <>
          <Line
            points={[centralPoint, procurementNode.position]}
            color={procurementNode.glowColor}
            lineWidth={2.4}
            transparent
            opacity={0.85}
          />
          <EnergyPulse start={centralPoint} end={procurementNode.position} speed={1.1} color={procurementNode.glowColor} />
        </>
      )}

      {/* 5. Procurement -> Company Behavior (Bottom) */}
      {procurementNode && companyNode && (
        <>
          <Line
            points={[procurementNode.position, companyNode.position]}
            color={companyNode.glowColor}
            lineWidth={1.5}
            transparent
            opacity={0.55}
          />
          <EnergyPulse start={procurementNode.position} end={companyNode.position} speed={0.75} color={companyNode.glowColor} />
        </>
      )}
    </group>
  );
}

// Main 3D Scene Controller Component
export default function ProcureMindScene() {
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [coreHovered, setCoreHovered] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const activeNodeInfo = NODES.find((n) => n.id === activeNodeId);

  return (
    <div className="procuremind-3d-wrapper">
      {/* 3D Scene Header & Meta Overlay */}
      <div className="scene-overlay-header">
        <div className="scene-overlay-left">
          <div className="scene-status-badge">
            <span className="scene-pulse-dot" />
            <span>NEURAL DECISION ARCHITECTURE</span>
          </div>
          <h2 className="scene-overlay-title">AI Procurement Intelligence Flow</h2>
          <p className="scene-overlay-subtitle">
            MARKET &bull; VENDORS &bull; EXPENSES &rarr; [ AI CORE ] &rarr; PROCUREMENT &rarr; BEHAVIOR
          </p>
        </div>

        {/* Interactive Control Buttons */}
        <div className="scene-overlay-controls">
          <button
            type="button"
            className={`btn-scene-control ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Continuous Rotation"
          >
            <span>{autoRotate ? 'Pause Rotation' : 'Auto-Rotate'}</span>
          </button>
          <button
            type="button"
            className="btn-scene-control"
            onClick={handleResetCamera}
            title="Reset Perspective"
          >
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Three.js Canvas Container */}
      <div className="scene-canvas-container">
        <Canvas
          camera={{ position: [0, 0.2, 8.4], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent', height: '420px', width: '100%' }}
        >
          {/* Scene Fog */}
          <fog attach="fog" args={['#090e1a', 9, 22]} />

          {/* Lighting */}
          <ambientLight intensity={0.85} color="#94A3B8" />
          <pointLight position={[0, 0, 0]} intensity={3.5} distance={12} color="#60A5FA" />
          <pointLight position={[-6, 4, 3]} intensity={1.5} color="#818CF8" />
          <pointLight position={[6, 4, 3]} intensity={1.5} color="#34D399" />
          <pointLight position={[0, -5, 3]} intensity={2.0} color="#3B82F6" />
          <directionalLight position={[0, 8, 6]} intensity={1.2} color="#FFFFFF" />

          {/* Gentle Floating Group */}
          <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35}>
            <Sparkles count={40} scale={12} size={1.8} speed={0.4} color="#60A5FA" opacity={0.45} />
            <CentralAiCore isHovered={coreHovered} onHover={setCoreHovered} />
            <ConnectionLines nodes={NODES} />
            {NODES.map((node) => (
              <IntelligenceNode
                key={node.id}
                node={node}
                activeNodeId={activeNodeId}
                onSelectNode={(id) =>
                  setActiveNodeId(activeNodeId === id ? null : id)
                }
              />
            ))}
          </Float>

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={5}
            maxDistance={13}
            maxPolarAngle={Math.PI / 2 + 0.25}
            minPolarAngle={Math.PI / 3 - 0.25}
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
            enableDamping={true}
            dampingFactor={0.06}
          />
        </Canvas>
      </div>

      {/* Bottom Topology Legend */}
      <div className="scene-footer-bar">
        <div className="scene-legend-item">
          <span className="legend-dot dot-cyan" />
          <span className="legend-label">Market Data</span>
        </div>
        <div className="scene-legend-separator">&bull;</div>
        <div className="scene-legend-item">
          <span className="legend-dot dot-indigo" />
          <span className="legend-label">Vendors</span>
        </div>
        <div className="scene-legend-separator">&rarr;</div>
        <div className="scene-legend-item scene-legend-core">
          <span className="legend-dot dot-blue" />
          <span className="legend-label">AI Procurement Core</span>
        </div>
        <div className="scene-legend-separator">&larr;</div>
        <div className="scene-legend-item">
          <span className="legend-dot dot-emerald" />
          <span className="legend-label">Expenses</span>
        </div>
        <div className="scene-legend-separator">&rarr;</div>
        <div className="scene-legend-item">
          <span className="legend-dot dot-blue" />
          <span className="legend-label">Procurement Decisions</span>
        </div>
        <div className="scene-legend-separator">&rarr;</div>
        <div className="scene-legend-item">
          <span className="legend-dot dot-pink" />
          <span className="legend-label">Company Behavior</span>
        </div>
      </div>

      {/* Selected Node Telemetry Strip */}
      {activeNodeInfo && (
        <div className="scene-node-detail-strip">
          <div className="strip-left">
            <span
              className="strip-indicator"
              style={{ backgroundColor: activeNodeInfo.glowColor }}
            />
            <div>
              <span className="strip-cat">{activeNodeInfo.category}</span>
              <h4 className="strip-name">{activeNodeInfo.name}</h4>
            </div>
          </div>
          <div className="strip-mid">
            <span className="strip-stat-label">Real-time Stream:</span>
            <span className="strip-stat-value">{activeNodeInfo.stat}</span>
          </div>
          <button
            type="button"
            className="strip-close"
            onClick={() => setActiveNodeId(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
