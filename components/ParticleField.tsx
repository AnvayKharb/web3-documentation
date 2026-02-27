'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
}

function Particles({ count = 3000, color = '#38BDF8', size = 0.015 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position in a sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.random() * 5 + 2;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions with wave motion
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];
      
      // Add wave effect
      positions[i3 + 1] += Math.sin(time + positions[i3] * 0.5) * 0.002;
      
      // Mouse interaction
      const mouseX = (mouse.x * viewport.width) / 2;
      const mouseY = (mouse.y * viewport.height) / 2;
      const dx = positions[i3] - mouseX;
      const dy = positions[i3 + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        const force = (2 - dist) * 0.01;
        positions[i3] += dx * force;
        positions[i3 + 1] += dy * force;
      }
      
      // Respawn particles that go too far
      const totalDist = Math.sqrt(
        positions[i3] ** 2 + 
        positions[i3 + 1] ** 2 + 
        positions[i3 + 2] ** 2
      );
      
      if (totalDist > 8) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = Math.random() * 2 + 2;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function NetworkLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const lineCount = 50;
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(lineCount * 6);
    
    for (let i = 0; i < lineCount; i++) {
      const i6 = i * 6;
      // Start point
      positions[i6] = (Math.random() - 0.5) * 8;
      positions[i6 + 1] = (Math.random() - 0.5) * 8;
      positions[i6 + 2] = (Math.random() - 0.5) * 8;
      // End point
      positions[i6 + 3] = (Math.random() - 0.5) * 8;
      positions[i6 + 4] = (Math.random() - 0.5) * 8;
      positions[i6 + 5] = (Math.random() - 0.5) * 8;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Animate line opacity
    const material = linesRef.current.material as THREE.LineBasicMaterial;
    material.opacity = 0.1 + Math.sin(time) * 0.05;
    
    linesRef.current.rotation.y = time * 0.02;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#38BDF8" 
        transparent 
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function BlockchainNodes() {
  const nodesRef = useRef<THREE.Group>(null);
  const nodeCount = 8;
  
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ),
      scale: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useFrame((state) => {
    if (!nodesRef.current) return;
    const time = state.clock.getElapsedTime();
    
    nodesRef.current.children.forEach((child, i) => {
      child.scale.setScalar(nodes[i].scale * (1 + Math.sin(time * 2 + i) * 0.2));
      child.rotation.x = time * 0.5;
      child.rotation.y = time * 0.3;
    });
  });

  return (
    <group ref={nodesRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <octahedronGeometry args={[node.scale, 0]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#38BDF8' : '#7DD3FC'}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Particles count={4000} />
      <NetworkLines />
      <BlockchainNodes />
    </>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
