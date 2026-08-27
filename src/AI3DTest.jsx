import React from 'react';
import { Canvas } from '@react-three/fiber';

function Cube() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4f46e5" />
    </mesh>
  );
}

export default function AI3DTest() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <Cube />
      </Canvas>
    </div>
  );
}