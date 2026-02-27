'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CentralHubProps {
  position: [number, number, number];
}

export default function CentralHub({ position }: CentralHubProps) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y += 0.008;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= 0.012;
    }
  });

  return (
    <group position={position}>
      {/* Core glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color="#7B2FBE" />
      </mesh>

      {/* Glow shells - concentric transparent layers */}
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color="#7B2FBE" transparent opacity={0.3} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color="#7B2FBE" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshBasicMaterial color="#7B2FBE" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Orbital Ring 1 - Cyan */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.85, 0.008, 8, 64]} />
        <meshBasicMaterial color="#00BFFF" transparent opacity={0.8} />
      </mesh>

      {/* Orbital Ring 2 - Pink */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 6, 0, Math.PI / 9]}>
        <torusGeometry args={[0.75, 0.006, 8, 64]} />
        <meshBasicMaterial color="#FF6B9D" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
