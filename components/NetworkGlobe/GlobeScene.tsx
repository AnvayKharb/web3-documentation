'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clusters, connections } from './clusterData';
import ClusterSphere from './ClusterSphere';
import CentralHub from './CentralHub';
import ConnectionLines from './ConnectionLines';

interface GlobeSceneProps {
  isRotating: boolean;
}

export default function GlobeScene({ isRotating }: GlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  // Create main wireframe globe geometry
  const globeWireframe = useMemo(() => {
    const sphereGeo = new THREE.IcosahedronGeometry(1.8, 2);
    return new THREE.WireframeGeometry(sphereGeo);
  }, []);

  // Rotate the entire scene
  useFrame((state, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main wireframe globe */}
      <lineSegments ref={wireframeRef} geometry={globeWireframe}>
        <lineBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.12}
        />
      </lineSegments>

      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Grid lines for depth */}
      <gridHelper
        args={[4, 20, '#38BDF8', '#38BDF8']}
        position={[0, -1.9, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Central hub */}
      <CentralHub position={[0, 0, 0.8]} />

      {/* Cluster spheres */}
      {clusters
        .filter((cluster) => cluster.id !== 'daos')
        .map((cluster) => (
          <ClusterSphere
            key={cluster.id}
            cluster={cluster}
            nodes={cluster.nodes}
          />
        ))}

      {/* Connection lines between clusters */}
      <ConnectionLines connections={connections} />

      {/* Ambient particles */}
      <Points count={200} />
    </group>
  );
}

// Floating ambient particles
function Points({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 0.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38BDF8"
        size={0.008}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}
