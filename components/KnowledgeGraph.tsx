'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';
import { useRouter } from 'next/navigation';

interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  slug: string;
  connections: number;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

const nodes: GraphNode[] = [
  { id: '1', label: 'Blockchain', category: 'core', slug: 'blockchain', connections: 8, x: 0, y: 0 },
  { id: '2', label: 'Smart Contracts', category: 'core', slug: 'smart-contracts', connections: 6, x: 0, y: 0 },
  { id: '3', label: 'DeFi', category: 'application', slug: 'defi', connections: 5, x: 0, y: 0 },
  { id: '4', label: 'Consensus', category: 'core', slug: 'consensus', connections: 4, x: 0, y: 0 },
  { id: '5', label: 'Layer 2', category: 'scaling', slug: 'layer2', connections: 4, x: 0, y: 0 },
  { id: '6', label: 'ZK Proofs', category: 'cryptography', slug: 'zk-proofs', connections: 3, x: 0, y: 0 },
  { id: '7', label: 'Tokenomics', category: 'economics', slug: 'tokenomics', connections: 3, x: 0, y: 0 },
  { id: '8', label: 'DAOs', category: 'governance', slug: 'daos', connections: 3, x: 0, y: 0 },
  { id: '9', label: 'Wallets', category: 'infrastructure', slug: 'wallets', connections: 4, x: 0, y: 0 },
  { id: '10', label: 'Web3', category: 'core', slug: 'introduction', connections: 7, x: 0, y: 0 },
];

const links: GraphLink[] = [
  { source: '1', target: '2' },
  { source: '1', target: '4' },
  { source: '1', target: '5' },
  { source: '1', target: '10' },
  { source: '2', target: '3' },
  { source: '2', target: '8' },
  { source: '2', target: '9' },
  { source: '3', target: '7' },
  { source: '3', target: '5' },
  { source: '4', target: '6' },
  { source: '5', target: '6' },
  { source: '6', target: '2' },
  { source: '7', target: '8' },
  { source: '8', target: '9' },
  { source: '9', target: '10' },
  { source: '10', target: '3' },
];

const categoryColors: Record<string, string> = {
  core: '#4F46E5',
  application: '#E8A844',
  scaling: '#6366F1',
  cryptography: '#22C55E',
  economics: '#818CF8',
  governance: '#A5B4FC',
  infrastructure: '#4F46E5',
};

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;

    // Create simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create gradient definitions
    const defs = svg.append('defs');
    
    Object.entries(categoryColors).forEach(([category, color]) => {
      const gradient = defs
        .append('radialGradient')
        .attr('id', `gradient-${category}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      
      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.8);
      
      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.2);
    });

    // Create links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#4F46E5')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1);

    // Create node groups
    const nodeGroup = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
      );

    // Add orbital rings for major nodes
    nodeGroup
      .filter((d) => d.connections >= 5)
      .append('circle')
      .attr('r', (d) => 30 + d.connections * 3)
      .attr('fill', 'none')
      .attr('stroke', (d) => categoryColors[d.category])
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4');

    // Add outer glow
    nodeGroup
      .append('circle')
      .attr('r', (d) => 20 + d.connections * 2)
      .attr('fill', (d) => `url(#gradient-${d.category})`)
      .attr('opacity', 0.5);

    // Add main node circle
    nodeGroup
      .append('circle')
      .attr('r', (d) => 15 + d.connections)
      .attr('fill', '#0a0a0f')
      .attr('stroke', (d) => categoryColors[d.category])
      .attr('stroke-width', 2);

    // Add labels
    nodeGroup
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => 30 + d.connections)
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-jetbrains)');

    // Add event handlers
    nodeGroup
      .on('mouseenter', function (event, d) {
        setHoveredNode(d);
        d3.select(this)
          .select('circle:nth-child(2)')
          .transition()
          .duration(200)
          .attr('opacity', 0.8);
      })
      .on('mouseleave', function () {
        setHoveredNode(null);
        d3.select(this)
          .select('circle:nth-child(2)')
          .transition()
          .duration(200)
          .attr('opacity', 0.5);
      })
      .on('click', (event, d) => {
        setSelectedNode(d);
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x || 0)
        .attr('y1', (d) => (d.source as GraphNode).y || 0)
        .attr('x2', (d) => (d.target as GraphNode).x || 0)
        .attr('y2', (d) => (d.target as GraphNode).y || 0);

      nodeGroup.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions]);

  const handleNavigate = () => {
    if (selectedNode) {
      router.push(`/docs/${selectedNode.slug}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600px] card-surface rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 card-surface rounded-lg p-4">
        <h4 className="font-sans font-medium text-xs text-accent-primary tracking-wider mb-3">
          CATEGORIES
        </h4>
        <div className="space-y-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-xs text-text-secondary capitalize">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hovered node info */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            className="absolute bottom-4 left-4 card-surface rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="font-sans font-medium text-sm text-text-primary">{hoveredNode.label}</div>
            <div className="font-mono text-xs text-text-secondary">
              {hoveredNode.connections} connections
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected node panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute top-4 right-4 card-surface rounded-lg p-6 w-64"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
          >
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-2 right-2 text-text-muted hover:text-text-primary"
            >
              ✕
            </button>
            
            <div
              className="w-4 h-4 rounded-full mb-3"
              style={{ backgroundColor: categoryColors[selectedNode.category] }}
            />
            <h3 className="font-sans font-semibold text-lg text-text-primary mb-2">
              {selectedNode.label}
            </h3>
            <p className="font-mono text-xs text-text-secondary mb-4">
              Category: {selectedNode.category}
              <br />
              Connections: {selectedNode.connections}
            </p>
            
            <motion.button
              onClick={handleNavigate}
              className="w-full px-4 py-2 font-sans font-medium text-xs bg-accent-primary/10 border border-accent-primary/30 rounded text-accent-primary hover:bg-accent-primary/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              EXPLORE →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
