'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ClusterData, ClusterNode } from './clusterData';
import ClusterInfoCard from './ClusterInfoCard';

interface ClusterSphereProps {
  cluster: ClusterData;
  nodes: ClusterNode[];
}

export default function ClusterSphere({ cluster, nodes }: ClusterSphereProps) {
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Create wireframe geometry
  const wireframeGeometry = useMemo(() => {
    const sphereGeo = new THREE.IcosahedronGeometry(cluster.radius, 1);
    return new THREE.WireframeGeometry(sphereGeo);
  }, [cluster.radius]);

  // Create internal connection lines between nodes
  const internalLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // Connect each node to 2-3 nearby nodes
    nodes.forEach((node, i) => {
      const connectTo = [(i + 1) % nodes.length, (i + 2) % nodes.length];
      connectTo.forEach(j => {
        points.push(new THREE.Vector3(...node.position));
        points.push(new THREE.Vector3(...nodes[j].position));
      });
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  // Animate nodes pulse
  const time = useRef(0);
  useFrame((state, delta) => {
    time.current += delta;
    
    if (nodesRef.current) {
      const dummy = new THREE.Object3D();
      nodes.forEach((node, i) => {
        const scale = 1 + 0.2 * Math.sin(time.current * 2 + i * 0.5);
        dummy.position.set(...node.position);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        nodesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const clusterColor = cluster.wireframeColor;

  return (
    <group position={cluster.position}>
      {/* Wireframe sphere */}
      <lineSegments ref={wireframeRef} geometry={wireframeGeometry}>
        <lineBasicMaterial
          color={clusterColor}
          transparent
          opacity={cluster.wireframeOpacity}
        />
      </lineSegments>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[cluster.radius * 0.95, 16, 16]} />
        <meshBasicMaterial
          color={clusterColor}
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Internal node connection lines */}
      <lineSegments geometry={internalLines}>
        <lineBasicMaterial
          color={clusterColor}
          transparent
          opacity={0.15}
        />
      </lineSegments>

      {/* Pulsing nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color={clusterColor} />
      </instancedMesh>

      {/* Floating label */}
      <Html
        position={[0, cluster.radius + 0.15, 0]}
        center
        style={{ pointerEvents: 'auto' }}
        distanceFactor={4}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              color: clusterColor,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              textShadow: `0 0 8px ${clusterColor}`,
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {cluster.title}
          </span>
          <ClusterInfoCard
            isVisible={hovered}
            title={cluster.title}
            description={cluster.description}
            slug={cluster.slug}
            accentColor={clusterColor}
          />
        </div>
      </Html>
    </group>
  );
}
