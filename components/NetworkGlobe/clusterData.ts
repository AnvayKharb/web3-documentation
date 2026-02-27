export interface ClusterNode {
  id: string;
  position: [number, number, number];
  color: string;
  label: string;
}

export interface ClusterData {
  id: string;
  title: string;
  description: string;
  slug: string;
  position: [number, number, number];
  wireframeColor: string;
  wireframeOpacity: number;
  radius: number;
  nodes: ClusterNode[];
  labelOffset: [number, number, number];
}

// Generate random nodes within a sphere
export function generateNodes(
  count: number,
  radius: number,
  baseColor: string,
  clusterId: string,
  labels: string[]
): ClusterNode[] {
  const nodes: ClusterNode[] = [];
  for (let i = 0; i < count; i++) {
    // Random position within sphere volume
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * 0.7 * Math.cbrt(Math.random());
    
    nodes.push({
      id: `${clusterId}-node-${i}`,
      position: [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ],
      color: baseColor,
      label: labels[i] || `Node ${i + 1}`,
    });
  }
  return nodes;
}

export const clusters: ClusterData[] = [
  {
    id: 'blockchain-basics',
    title: 'Blockchain Basics',
    description: 'Fundamental concepts of distributed ledger technology.',
    slug: 'introduction',
    position: [0.5, 2.2, 0],
    wireframeColor: '#1A8FE3',
    wireframeOpacity: 0.4,
    radius: 1.1,
    nodes: generateNodes(4, 1.1, '#1A8FE3', 'blockchain', [
      'Consensus',
      'Cryptography',
      'Blocks',
      'Hashing',
    ]),
    labelOffset: [0, 1.8, 0],
  },
  {
    id: 'defi-tokenomics',
    title: 'DeFi & Tokenomics',
    description: 'Decentralized finance protocols and token economics.',
    slug: 'defi',
    position: [2.0, 0.5, -0.5],
    wireframeColor: '#C0392B',
    wireframeOpacity: 0.35,
    radius: 1.4,
    nodes: generateNodes(5, 1.4, '#E74C3C', 'defi', [
      'AMM',
      'Lending',
      'Staking',
      'Yield',
      'Liquidity',
    ]),
    labelOffset: [1.8, 0, 0],
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contracts',
    description: 'Self-executing code on the blockchain.',
    slug: 'smart-contracts',
    position: [-2.2, 0.2, 0.3],
    wireframeColor: '#1A8FE3',
    wireframeOpacity: 0.3,
    radius: 1.3,
    nodes: generateNodes(5, 1.3, '#17A2B8', 'contracts', [
      'Solidity',
      'EVM',
      'Gas',
      'Deploy',
      'Verify',
    ]),
    labelOffset: [-1.6, 0, 0],
  },
  {
    id: 'layer2-zk',
    title: 'Layer 2 & ZK Proofs',
    description: 'Scaling solutions and zero-knowledge technology.',
    slug: 'layer2',
    position: [0.2, -1.8, 0.5],
    wireframeColor: '#27AE60',
    wireframeOpacity: 0.35,
    radius: 1.2,
    nodes: generateNodes(4, 1.2, '#2ECC71', 'layer2', [
      'Rollups',
      'ZK-SNARKs',
      'State Channels',
      'Plasma',
    ]),
    labelOffset: [0, -1.6, 0],
  },
  {
    id: 'daos-governance',
    title: 'DAOs & Governance',
    description: 'Decentralized organizations and voting systems.',
    slug: 'governance',
    position: [0, 0, 0.8],
    wireframeColor: '#7B2FBE',
    wireframeOpacity: 0.3,
    radius: 1.0,
    nodes: generateNodes(4, 1.0, '#9B59B6', 'daos', [
      'Voting',
      'Treasury',
      'Proposals',
      'Tokens',
    ]),
    labelOffset: [0, -0.7, 0],
  },
];

// Connection definitions for dashed lines
export interface Connection {
  from: string;
  to: string;
  color: string;
}

export const connections: Connection[] = [
  { from: 'daos-governance', to: 'blockchain-basics', color: '#9B59B6' },
  { from: 'daos-governance', to: 'defi-tokenomics', color: '#FF6B9D' },
  { from: 'daos-governance', to: 'layer2-zk', color: '#BDC3C7' },
  { from: 'blockchain-basics', to: 'smart-contracts', color: '#1A8FE3' },
];

// Get cluster by ID
export function getClusterById(id: string): ClusterData | undefined {
  return clusters.find((c) => c.id === id);
}
