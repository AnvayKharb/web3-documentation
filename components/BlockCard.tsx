'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

interface BlockCardProps {
  title?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  blockHeight?: number;
  blockNumber?: number;
  className?: string;
  delay?: number;
}

export default function BlockCard({ 
  title, 
  content, 
  children,
  blockHeight,
  blockNumber,
  className = '',
  delay = 0
}: BlockCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hash, setHash] = useState('');
  const [showScanline, setShowScanline] = useState(false);

  useEffect(() => {
    // Generate random hash
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 8; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setHash(result);
  }, []);

  useEffect(() => {
    if (isInView) {
      setShowScanline(true);
      const timeout = setTimeout(() => setShowScanline(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
    >
      {/* Chain link connector */}
      <motion.div
        className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
        style={{ 
          background: 'linear-gradient(to bottom, transparent, #38BDF8)',
          transformOrigin: 'top'
        }}
      />

      {/* Main card */}
      <div className="relative card-surface rounded-lg overflow-hidden group">
        {/* Scanline effect on enter */}
        <AnimatePresence>
          {showScanline && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-accent-primary/40"
                initial={{ top: '-4px' }}
                animate={{ top: '100%' }}
                transition={{ duration: 0.6, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-elevated/50">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 rounded-full bg-accent-primary"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-sans font-medium text-xs text-accent-primary tracking-wider uppercase">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {(blockHeight || blockNumber) && (
              <span className="font-mono text-xs text-accent-primary">
                BLOCK #{blockHeight || blockNumber}
              </span>
            )}
            <span className="font-mono text-xs text-text-muted">
              {hash}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {children || content}
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, transparent 50%, rgba(56, 189, 248, 0.05) 100%)',
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-border-subtle" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-border-subtle" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-border-subtle" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-border-subtle" />
      </div>

      {/* Chain link to next block */}
      <motion.svg
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-8"
        viewBox="0 0 32 32"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: delay + 0.4 }}
      >
        <motion.path
          d="M16 0 L16 8 M12 4 L16 8 L20 4"
          stroke="#38BDF8"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Chain connector SVG component
export function ChainConnector({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <svg
      ref={ref}
      className={`w-full h-16 ${className}`}
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      {/* Chain links */}
      <motion.path
        d="M100 0 L100 60"
        stroke="url(#chainGradient)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8 }}
      />
      
      {/* Link circles */}
      {[15, 30, 45].map((y, i) => (
        <motion.circle
          key={i}
          cx="100"
          cy={y}
          r="3"
          fill="#38BDF8"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2 * i + 0.3 }}
        />
      ))}
    </svg>
  );
}
