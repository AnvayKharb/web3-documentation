'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlobeScene from './GlobeScene';

export default function NetworkGlobe() {
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 4.5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        style={{
          background: 'transparent',
        }}
        onPointerDown={() => setIsRotating(false)}
        onPointerUp={() => setIsRotating(true)}
        onPointerLeave={() => setIsRotating(true)}
      >
        <Suspense fallback={null}>
          <GlobeScene isRotating={isRotating} />
        </Suspense>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 3 / 4}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Gradient overlay at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to top, #000008, transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
