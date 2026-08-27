// src/components/3d/ProcureMindBackground3D.jsx
/**
 * ProcureMind 3D Immersive Background
 *
 * An ambient, non-intrusive 3D Neural Procurement Network floating in space.
 * Features:
 * - Multi-node neural procurement clusters (Vendors, Pricing, Risk, Negotiation, Decision)
 * - Animated particle data streams
 * - Orbital geometric rings and soft volumetric glow
 * - Rich dynamic responsiveness to autonomous agent states (5 distinct states)
 * - Strict pointer-events: none (zero interaction interference)
 * - Accessibility-aware: respects prefers-reduced-motion
 * - Lightweight mobile scaling (auto particle/DPR reduction)
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { subscribeToAgentState, AGENT_STATES } from '../../services/agentService.js';

// Deterministic pseudo-random — no Math.random() in render (purity rule)
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 91237.4523;
  return x - Math.floor(x);
}

// ── 1. Neural Network Mesh ───────────────────────────────────────────────────
function NeuralNetworkMesh({ agentState, isMobile, reducedMotion }) {
  const groupRef = useRef();
  const linesRef = useRef();
  const timeRef = useRef(0);

  const isAnalyzing =
    agentState === AGENT_STATES.INGESTING ||
    agentState === AGENT_STATES.ANALYZING ||
    agentState === AGENT_STATES.BENCHMARKING ||
    agentState === AGENT_STATES.VENDOR_INTELLIGENCE ||
    agentState === AGENT_STATES.RISK_ANALYSIS;

  const isNegotiating = agentState === AGENT_STATES.NEGOTIATING;
  const isCompleted = agentState === AGENT_STATES.COMPLETED;
  const isReady = agentState === AGENT_STATES.RECOMMENDATION_READY;

  // Deterministic procurement intelligence topology
  const nodes = useMemo(() => {
    const count = isMobile ? 9 : 20;
    const pts = [];

    // Focal hub nodes representing the procurement pipeline stages
    pts.push({ pos: new THREE.Vector3(0, 0.4, 0),       color: '#3B82F6', size: 0.38, label: 'Core' });
    pts.push({ pos: new THREE.Vector3(-3.2, 1.4, -1.5), color: '#8B5CF6', size: 0.29, label: 'Vendors' });
    pts.push({ pos: new THREE.Vector3(3.4, -0.7, -1.3), color: '#06B6D4', size: 0.27, label: 'Benchmarks' });
    pts.push({ pos: new THREE.Vector3(-2.2, -1.9, -0.9),color: '#F59E0B', size: 0.25, label: 'Risk' });
    pts.push({ pos: new THREE.Vector3(2.4, 2.0, -1.7),  color: '#EC4899', size: 0.26, label: 'Negotiation' });
    pts.push({ pos: new THREE.Vector3(0.3, -2.4, -1.1), color: '#10B981', size: 0.32, label: 'Decision' });
    pts.push({ pos: new THREE.Vector3(-3.8, -0.5, -2.2),color: '#A855F7', size: 0.19, label: 'Spend' });
    pts.push({ pos: new THREE.Vector3(3.0, 1.2, -2.8),  color: '#38BDF8', size: 0.17, label: 'Analytics' });
    pts.push({ pos: new THREE.Vector3(-1.2, 3.0, -1.9), color: '#818CF8', size: 0.20, label: 'Insights' });

    // Ambient peripheral satellite nodes
    for (let i = 9; i < count; i++) {
      const r1 = seededRand(i * 17.13);
      const r2 = seededRand(i * 31.41);
      const r3 = seededRand(i * 47.92);
      const radius = 4.0 + r1 * 2.5;
      const theta = (i / count) * Math.PI * 2 + r2 * 0.5;
      const phi = (r3 - 0.5) * Math.PI * 0.55;
      pts.push({
        pos: new THREE.Vector3(
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(phi) + (r2 - 0.5) * 1.2,
          radius * Math.sin(theta) * Math.cos(phi) - 2.8
        ),
        color: i % 3 === 0 ? '#6366F1' : i % 2 === 0 ? '#38BDF8' : '#A855F7',
        size: 0.08 + r1 * 0.08,
      });
    }
    return pts;
  }, [isMobile]);

  // Interconnecting neural link geometry
  const linePositions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < 4.5) {
          pts.push(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z);
          pts.push(nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
        }
      }
    }
    return new Float32Array(pts);
  }, [nodes]);

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return;
    const t = clock.getElapsedTime();
    timeRef.current = t;

    // Rotation speed varies by agent state
    const rotSpeed = isNegotiating ? 0.55 : isAnalyzing ? 0.32 : isCompleted ? 0.18 : 0.10;
    const wobble = isAnalyzing ? 0.12 : isNegotiating ? 0.08 : 0.05;

    groupRef.current.rotation.y = t * rotSpeed * 0.5;
    groupRef.current.rotation.x = Math.sin(t * rotSpeed * 0.4) * wobble;
  });

  // Line color by state
  const lineColor = isNegotiating ? '#C084FC'
    : isCompleted || isReady ? '#34D399'
    : isAnalyzing ? '#60A5FA'
    : '#38BDF8';

  const lineOpacity = isAnalyzing ? 0.42 : isNegotiating ? 0.38 : 0.18;

  return (
    <group ref={groupRef}>
      {/* Neural connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={lineColor} transparent opacity={lineOpacity} />
      </lineSegments>

      {/* Node spheres */}
      {nodes.map((n, idx) => (
        <mesh key={idx} position={[n.pos.x, n.pos.y, n.pos.z]}>
          <sphereGeometry args={[n.size, 16, 16]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={
              isNegotiating ? 2.0
              : isCompleted || isReady ? 1.8
              : isAnalyzing ? 1.6
              : 0.85
            }
            roughness={0.15}
            metalness={0.75}
            transparent
            opacity={0.90}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── 2. Ambient Particle Field ─────────────────────────────────────────────────
function AmbientParticleField({ count, agentState, reducedMotion }) {
  const pointsRef = useRef();

  const isActive =
    agentState === AGENT_STATES.INGESTING ||
    agentState === AGENT_STATES.ANALYZING ||
    agentState === AGENT_STATES.BENCHMARKING ||
    agentState === AGENT_STATES.VENDOR_INTELLIGENCE ||
    agentState === AGENT_STATES.RISK_ANALYSIS ||
    agentState === AGENT_STATES.NEGOTIATING;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#38BDF8'),
      new THREE.Color('#818CF8'),
      new THREE.Color('#C084FC'),
      new THREE.Color('#34D399'),
      new THREE.Color('#60A5FA'),
    ];

    for (let i = 0; i < count; i++) {
      const r1 = seededRand(i * 19.87);
      const r2 = seededRand(i * 23.45);
      const r3 = seededRand(i * 29.11);
      pos[i * 3]     = (r1 - 0.5) * 18;
      pos[i * 3 + 1] = (r2 - 0.5) * 14;
      pos[i * 3 + 2] = (r3 - 0.5) * 11 - 2;
      const c = palette[Math.floor(r1 * palette.length) % palette.length];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (reducedMotion || !pointsRef.current) return;
    const t = clock.getElapsedTime();
    const speed = isActive ? 0.14 : 0.04;
    pointsRef.current.rotation.y = t * speed;
    pointsRef.current.rotation.z = Math.sin(t * speed * 0.6) * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={isActive ? 0.08 : 0.05}
        vertexColors
        transparent
        opacity={isActive ? 0.75 : 0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ── 3. Orbital Rings ─────────────────────────────────────────────────────────
function OrbitalRings({ agentState, reducedMotion }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  const isNegotiating = agentState === AGENT_STATES.NEGOTIATING;
  const isAnalyzing =
    agentState === AGENT_STATES.INGESTING ||
    agentState === AGENT_STATES.ANALYZING ||
    agentState === AGENT_STATES.BENCHMARKING ||
    agentState === AGENT_STATES.VENDOR_INTELLIGENCE ||
    agentState === AGENT_STATES.RISK_ANALYSIS;
  const isCompleted = agentState === AGENT_STATES.COMPLETED;

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    const m = isNegotiating ? 2.2 : isAnalyzing ? 1.7 : 1.0;
    if (ring1.current) {
      ring1.current.rotation.x = 1.1 + Math.sin(t * 0.22 * m) * 0.12;
      ring1.current.rotation.y = t * 0.14 * m;
    }
    if (ring2.current) {
      ring2.current.rotation.x = 0.75 + Math.cos(t * 0.18 * m) * 0.10;
      ring2.current.rotation.y = -t * 0.11 * m;
    }
    if (ring3.current) {
      ring3.current.rotation.z = t * 0.08 * m;
      ring3.current.rotation.x = Math.sin(t * 0.12 * m) * 0.15;
    }
  });

  const ring1Color = isNegotiating ? '#C084FC' : isCompleted ? '#34D399' : '#38BDF8';
  const ring2Color = isNegotiating ? '#8B5CF6' : '#818CF8';

  return (
    <group position={[0, 0, -2.2]}>
      <mesh ref={ring1}>
        <torusGeometry args={[5.0, 0.014, 16, 90]} />
        <meshBasicMaterial color={ring1Color} transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[6.6, 0.010, 16, 90]} />
        <meshBasicMaterial color={ring2Color} transparent opacity={0.16} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[3.8, 0.008, 16, 70]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// ── 4. Completion Pulse Ring (fires on COMPLETED state) ──────────────────────
function CompletionPulse({ active, reducedMotion }) {
  const pulseRef = useRef();

  useFrame(({ clock }) => {
    if (!active || reducedMotion || !pulseRef.current) return;
    const t = clock.getElapsedTime();
    const scale = 1.0 + Math.sin(t * 1.2) * 0.18;
    pulseRef.current.scale.setScalar(scale);
    pulseRef.current.material.opacity = 0.12 + Math.sin(t * 1.2) * 0.08;
  });

  if (!active) return null;

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshBasicMaterial color="#34D399" transparent opacity={0.12} wireframe />
    </mesh>
  );
}

// ── 5. Main Exported Component ───────────────────────────────────────────────
export default function ProcureMindBackground3D() {
  const [agentState, setAgentState] = useState(AGENT_STATES.IDLE);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = (e) => setReducedMotion(e.matches);
    motionMql.addEventListener('change', handleMotion);

    const unsubscribe = subscribeToAgentState((state) => {
      if (state?.state) setAgentState(state.state);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      motionMql.removeEventListener('change', handleMotion);
      unsubscribe();
    };
  }, []);

  const isCompleted = agentState === AGENT_STATES.COMPLETED;
  const particleCount = isMobile ? 45 : 150;

  return (
    <div
      className="pm-immersive-3d-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 40% 15%, #0d1b3e 0%, #0a1128 40%, #060913 100%)',
      }}
      aria-hidden="true"
    >
      {/* Atmospheric ambient glow spheres */}
      <div className="ambient-glow-sphere glow-1" />
      <div className="ambient-glow-sphere glow-2" />
      <div className="ambient-glow-sphere glow-3" />

      {/* WebGL 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 48 }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[12, 10, 6]} intensity={1.1} color="#93C5FD" />
        <pointLight
          position={[-10, -8, -5]}
          intensity={0.90}
          color={agentState === AGENT_STATES.NEGOTIATING ? '#C084FC' : '#A78BFA'}
        />
        <pointLight
          position={[0, 0, 4]}
          intensity={
            agentState === AGENT_STATES.NEGOTIATING ? 2.0
            : isCompleted ? 1.6
            : agentState !== AGENT_STATES.IDLE ? 1.3
            : 0.75
          }
          color={
            agentState === AGENT_STATES.NEGOTIATING ? '#C084FC'
            : isCompleted ? '#34D399'
            : '#60A5FA'
          }
        />

        <Float
          speed={reducedMotion ? 0 : 1.0}
          rotationIntensity={reducedMotion ? 0 : 0.25}
          floatIntensity={reducedMotion ? 0 : 0.35}
        >
          <NeuralNetworkMesh
            agentState={agentState}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
          <OrbitalRings agentState={agentState} reducedMotion={reducedMotion} />
          <CompletionPulse active={isCompleted} reducedMotion={reducedMotion} />
        </Float>

        <AmbientParticleField
          count={particleCount}
          agentState={agentState}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
