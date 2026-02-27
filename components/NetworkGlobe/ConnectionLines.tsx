'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { Connection, clusters } from './clusterData';

// Extend Three.js Line to R3F
extend({ Line_: THREE.Line });

interface ConnectionLinesProps {
  connections: Connection[];
}

function DashedLine({ 
  start, 
  end, 
  color, 
  index, 
  materialsRef 
}: { 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  color: string; 
  index: number;
  materialsRef: React.MutableRefObject<THREE.LineDashedMaterial[]>;
}) {
  const lineRef = useRef<THREE.Line>(null);

  // Create curved path using quadratic bezier
  const geometry = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const normal = mid.clone().normalize();
    mid.add(normal.multiplyScalar(0.3));
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(32);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineDashedMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      dashSize: 0.08,
      gapSize: 0.04,
    });
  }, [color]);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.computeLineDistances();
      materialsRef.current[index] = material;
    }
  }, [index, material, materialsRef]);

  return (
    <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />
  );
}

export default function ConnectionLines({ connections }: ConnectionLinesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.LineDashedMaterial[]>([]);

  // Animate dash offset
  useFrame((_, delta) => {
    materialsRef.current.forEach((mat) => {
      if (mat) {
        (mat as THREE.LineDashedMaterial & { dashOffset: number }).dashOffset -= delta * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {connections.map((conn, index) => {
        const fromCluster = clusters.find(c => c.id === conn.from);
        const toCluster = clusters.find(c => c.id === conn.to);
        
        if (!fromCluster || !toCluster) return null;

        const start = new THREE.Vector3(...fromCluster.position);
        const end = new THREE.Vector3(...toCluster.position);

        return (
          <DashedLine
            key={index}
            start={start}
            end={end}
            color={conn.color}
            index={index}
            materialsRef={materialsRef}
          />
        );
      })}
    </group>
  );
}
