// src/components/3d/ProcureMindScene.jsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../../context/useAuth';
import { subscribeToAgentState, AGENT_STATES } from '../../services/agentService';

// Central Floating AI Intelligence Core Component
function CentralAiCore({ isHovered, onHover, insightCount = 0, agentState = 'idle' }) {
  const outerGroupRef = useRef();
  const innerCoreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  const isAnalyzing =
    agentState === AGENT_STATES.INGESTING ||
    agentState === AGENT_STATES.ANALYZING ||
    agentState === AGENT_STATES.BENCHMARKING ||
    agentState === AGENT_STATES.VENDOR_INTELLIGENCE ||
    agentState === AGENT_STATES.RISK_ANALYSIS ||
    agentState === AGENT_STATES.NEGOTIATING ||
    agentState === AGENT_STATES.RECOMMENDATION_READY;

  const isCompleted = agentState === AGENT_STATES.COMPLETED;
  const hasInsights = insightCount > 0;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMultiplier = isAnalyzing ? 2.2 : 1.0;

    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y = t * 0.22 * speedMultiplier;
      outerGroupRef.current.rotation.x = Math.sin(t * 0.15 * speedMultiplier) * 0.06;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.35 * speedMultiplier;
      innerCoreRef.current.rotation.z = Math.cos(t * 0.3 * speedMultiplier) * 0.1;
      const pulseSpeed = isAnalyzing ? 4.0 : isCompleted ? 2.8 : hasInsights ? 2.2 : 1.4;
      const scale = 1 + Math.sin(t * pulseSpeed) * (isAnalyzing ? 0.08 : 0.03);
      innerCoreRef.current.scale.set(scale, scale, scale);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.35 * speedMultiplier;
      ring1Ref.current.rotation.y = t * 0.2 * speedMultiplier;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.3 * speedMultiplier;
      ring2Ref.current.rotation.z = t * 0.45 * speedMultiplier;
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
          emissive={isAnalyzing ? '#60A5FA' : isCompleted ? '#10B981' : hasInsights ? '#3B82F6' : '#2563EB'}
          emissiveIntensity={isHovered ? 3.0 : isAnalyzing ? 2.8 : isCompleted ? 2.2 : 1.4}
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
          emissiveIntensity={isAnalyzing ? 1.0 : 0.6}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Outer Octahedron Shield */}
      <mesh>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color={isAnalyzing ? '#BFDBFE' : '#93C5FD'}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Orbital Energy Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.7, 0.02, 16, 64]} />
        <meshStandardMaterial
          color={isAnalyzing ? '#93C5FD' : '#60A5FA'}
          emissive={isAnalyzing ? '#93C5FD' : '#60A5FA'}
          emissiveIntensity={isAnalyzing ? 2.0 : 1.2}
          transparent
          opacity={0.65}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.9, 0.015, 16, 64]} />
        <meshStandardMaterial
          color={isAnalyzing ? '#C7D2FE' : '#818CF8'}
          emissive={isAnalyzing ? '#C7D2FE' : '#818CF8'}
          emissiveIntensity={isAnalyzing ? 1.8 : 1.0}
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
          <div
            className="scene-ai-core-dot"
            style={{
              backgroundColor: isAnalyzing ? '#60A5FA' : isCompleted ? '#10B981' : hasInsights ? '#3B82F6' : '#2563EB',
            }}
          />
          <span className="scene-ai-core-text">
            {isAnalyzing
              ? 'AUTONOMOUS AGENT ACTIVE'
              : isCompleted
              ? 'RECOMMENDATION READY'
              : hasInsights
              ? `${insightCount} AI INSIGHTS ACTIVE`
              : 'PROCUREMIND INTELLIGENCE CORE'}
          </span>
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
      meshRef.current.rotation.y = t * 0.35;
      meshRef.current.rotation.x = t * 0.18;
      meshRef.current.position.y = node.position[1] + Math.sin(t * 1.4) * 0.08;
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
        scale={hovered || isSelected ? 1.25 : 1.0}
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
        <mesh position={[0, node.position[1], 0]} scale={1.6}>
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

// Connecting Lines representing DATA -> BENCHMARKS -> CORE -> INSIGHTS -> DECISIONS
function ConnectionLines({ nodes, isAnalyzing }) {
  const centralPoint = [0, 0, 0];
  const marketNode = nodes.find((n) => n.id === 'market-data');
  const vendorNode = nodes.find((n) => n.id === 'vendors');
  const expenseNode = nodes.find((n) => n.id === 'expenses');
  const procurementNode = nodes.find((n) => n.id === 'procurement');
  const companyNode = nodes.find((n) => n.id === 'company-behavior');

  const speedMult = isAnalyzing ? 1.8 : 1.0;

  return (
    <group>
      {/* 1. Market Data (Top / Analysis Layer) -> AI Core */}
      {marketNode && (
        <>
          <Line
            points={[marketNode.position, centralPoint]}
            color={marketNode.glowColor}
            lineWidth={1.6}
            transparent
            opacity={0.6}
          />
          <EnergyPulse start={marketNode.position} end={centralPoint} speed={0.9 * speedMult} color={marketNode.glowColor} />
        </>
      )}

      {/* 2. Vendors (Left / Data Layer) -> AI Core */}
      {vendorNode && (
        <>
          <Line
            points={[vendorNode.position, centralPoint]}
            color={vendorNode.glowColor}
            lineWidth={1.6}
            transparent
            opacity={0.6}
          />
          <EnergyPulse start={vendorNode.position} end={centralPoint} speed={0.85 * speedMult} color={vendorNode.glowColor} />
        </>
      )}

      {/* 3. Expenses (Right / Data Layer) -> AI Core */}
      {expenseNode && (
        <>
          <Line
            points={[expenseNode.position, centralPoint]}
            color={expenseNode.glowColor}
            lineWidth={1.6}
            transparent
            opacity={0.6}
          />
          <EnergyPulse start={expenseNode.position} end={centralPoint} speed={0.85 * speedMult} color={expenseNode.glowColor} />
        </>
      )}

      {/* 4. AI Core -> Procurement (Mid-Bottom / Insight Layer) */}
      {procurementNode && (
        <>
          <Line
            points={[centralPoint, procurementNode.position]}
            color={procurementNode.glowColor}
            lineWidth={2.2}
            transparent
            opacity={0.85}
          />
          <EnergyPulse start={centralPoint} end={procurementNode.position} speed={1.1 * speedMult} color={procurementNode.glowColor} />
        </>
      )}

      {/* 5. Procurement -> Decision & Actions (Bottom / Decision Layer) */}
      {procurementNode && companyNode && (
        <>
          <Line
            points={[procurementNode.position, companyNode.position]}
            color={companyNode.glowColor}
            lineWidth={1.5}
            transparent
            opacity={0.55}
          />
          <EnergyPulse start={procurementNode.position} end={companyNode.position} speed={0.75 * speedMult} color={companyNode.glowColor} />
        </>
      )}
    </group>
  );
}

// Main 3D Scene Controller Component
export default function ProcureMindScene() {
  const { metrics, currentUser, userData } = useAuth();
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [coreHovered, setCoreHovered] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [agentStatus, setAgentStatus] = useState({ state: AGENT_STATES.IDLE, message: '' });
  const controlsRef = useRef();

  useEffect(() => {
    const unsub = subscribeToAgentState((state) => {
      setAgentStatus(state);
    });
    return unsub;
  }, []);

  const insightCount = metrics.aiInsightsList?.length || 0;
  const isAnalyzing =
    agentStatus.state === AGENT_STATES.INGESTING ||
    agentStatus.state === AGENT_STATES.ANALYZING ||
    agentStatus.state === AGENT_STATES.BENCHMARKING ||
    agentStatus.state === AGENT_STATES.VENDOR_INTELLIGENCE ||
    agentStatus.state === AGENT_STATES.RISK_ANALYSIS ||
    agentStatus.state === AGENT_STATES.NEGOTIATING ||
    agentStatus.state === AGENT_STATES.RECOMMENDATION_READY;

  // Dynamically constructed nodes representing DATA -> ANALYSIS -> INSIGHT -> DECISION
  const dynamicNodes = useMemo(() => {
    return [
      {
        id: 'market-data',
        name: 'Market Intelligence',
        category: 'ANALYSIS LAYER',
        position: [0, 2.5, 0.2],
        color: '#06B6D4',
        glowColor: '#22D3EE',
        type: 'top-input',
        stat: userData?.marketData?.length > 0 ? `${userData.marketData.length} Live Benchmarks` : 'Rate Benchmarks',
        shape: 'tetrahedron',
      },
      {
        id: 'vendors',
        name: 'Vendor Base',
        category: 'DATA INGESTION',
        position: [-3.6, 0, 0.3],
        color: '#818CF8',
        glowColor: '#A5B4FC',
        type: 'left-input',
        stat: `${metrics.vendorCount} Suppliers`,
        shape: 'octahedron',
      },
      {
        id: 'expenses',
        name: 'Spend Ledger',
        category: 'DATA INGESTION',
        position: [3.6, 0, 0.3],
        color: '#10B981',
        glowColor: '#34D399',
        type: 'right-input',
        stat: `${metrics.totalSpendFormatted} Spend`,
        shape: 'octahedron',
      },
      {
        id: 'procurement',
        name: 'Insight Hub',
        category: 'INSIGHT LAYER',
        position: [0, -1.8, 0.3],
        color: '#3B82F6',
        glowColor: '#60A5FA',
        type: 'decision',
        stat: `${metrics.aiInsightsList?.length || 0} Insights`,
        shape: 'icosahedron',
      },
      {
        id: 'company-behavior',
        name: 'Decision Actions',
        category: 'DECISION LAYER',
        position: [0, -3.3, 0.2],
        color: '#EC4899',
        glowColor: '#F472B6',
        type: 'context',
        stat: `${metrics.pendingDecisionsCount || 0} Decisions`,
        shape: 'tetrahedron',
      },
    ];
  }, [metrics, userData]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const activeNodeInfo = dynamicNodes.find((n) => n.id === activeNodeId);

  return (
    <div className="procuremind-3d-wrapper">
      <div className="section-storytelling-tag" style={{ margin: '16px 20px 0' }}>04 • 3D NEURAL TELEMETRY CORE</div>
      {/* 3D Scene Header & Meta Overlay */}
      <div className="scene-overlay-header">
        <div className="scene-overlay-left">
          <div className="scene-status-badge">
            <span className={`scene-pulse-dot ${isAnalyzing ? 'pulse-fast' : ''}`} />
            <span>
              {isAnalyzing
                ? `AGENT PROCESSING: ${agentStatus.message}`
                : `NEURAL DECISION ARCHITECTURE • ${currentUser?.companyName || 'WORKSPACE'}`}
            </span>
          </div>
          <h2 className="scene-overlay-title">Autonomous AI Procurement Flow</h2>
          <p className="scene-overlay-subtitle">
            Ingestion ({metrics.vendorCount} Vendors, {metrics.totalSpendFormatted}) &rarr; Benchmarks &rarr; [ Intelligence Core ] &rarr; Insights ({insightCount}) &rarr; Decisions ({metrics.pendingDecisionsCount})
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
          <pointLight position={[0, 0, 0]} intensity={isAnalyzing ? 5.0 : 3.5} distance={12} color="#60A5FA" />
          <pointLight position={[-6, 4, 3]} intensity={1.5} color="#818CF8" />
          <pointLight position={[6, 4, 3]} intensity={1.5} color="#34D399" />
          <pointLight position={[0, -5, 3]} intensity={2.0} color="#3B82F6" />
          <directionalLight position={[0, 8, 6]} intensity={1.2} color="#FFFFFF" />

          {/* Gentle Floating Group */}
          <Float speed={isAnalyzing ? 2.0 : 1.2} rotationIntensity={0.12} floatIntensity={0.35}>
            <Sparkles count={isAnalyzing ? 70 : 40} scale={12} size={1.8} speed={isAnalyzing ? 0.8 : 0.4} color="#60A5FA" opacity={0.45} />
            <CentralAiCore isHovered={coreHovered} onHover={setCoreHovered} insightCount={insightCount} agentState={agentStatus.state} />
            <ConnectionLines nodes={dynamicNodes} isAnalyzing={isAnalyzing} />
            {dynamicNodes.map((node) => (
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
            autoRotateSpeed={isAnalyzing ? 1.5 : 0.6}
            enableDamping={true}
            dampingFactor={0.06}
          />
        </Canvas>
      </div>

      {/* Bottom Topology Legend */}
      <div className="scene-footer-bar">
        <div className="scene-legend-item">
          <span className="legend-dot dot-cyan" />
          <span className="legend-label">1. Ingestion</span>
        </div>
        <div className="scene-legend-separator">&rarr;</div>
        <div className="scene-legend-item">
          <span className="legend-dot dot-indigo" />
          <span className="legend-label">2. Benchmarks</span>
        </div>
        <div className="scene-legend-separator">&rarr;</div>
        <div className="scene-legend-item scene-legend-core">
          <span className="legend-dot dot-blue" />
          <span className="legend-label">3. Intelligence Core</span>
        </div>
        <div className="scene-legend-separator">&rarr;</div>
        <div className="scene-legend-item">
          <span className="legend-dot dot-emerald" />
          <span className="legend-label">4. Insights ({insightCount})</span>
        </div>
        <div className="scene-legend-separator">&rarr;</div>
        <div className="scene-legend-item">
          <span className="legend-dot dot-pink" />
          <span className="legend-label">5. Decisions ({metrics.pendingDecisionsCount})</span>
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
            <span className="strip-stat-label">Telemetry Status:</span>
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
