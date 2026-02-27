'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface Block {
  id: number;
  hash: string;
  section: string;
  timestamp: Date;
  isCurrent: boolean;
}

export default function BlockExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [, setCurrentSection] = useState('');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const generateHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 8; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section') || '';
            setCurrentSection(sectionName);
            
            // Add new block
            setBlocks((prev) => {
              const existing = prev.find((b) => b.section === sectionName);
              if (!existing) {
                const newBlocks = prev.map((b) => ({ ...b, isCurrent: false }));
                return [
                  ...newBlocks,
                  {
                    id: prev.length + 1,
                    hash: generateHash(),
                    section: sectionName,
                    timestamp: new Date(),
                    isCurrent: true,
                  },
                ].slice(-8); // Keep only last 8 blocks
              }
              return prev.map((b) => ({
                ...b,
                isCurrent: b.section === sectionName,
              }));
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden xl:block"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="card-surface rounded-lg p-4 w-48">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border-subtle">
          <motion.div
            className="w-2 h-2 rounded-full bg-accent-primary"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-sans font-medium text-xs text-accent-primary tracking-wider">
            BLOCK EXPLORER
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-primary"
              style={{ scaleX, transformOrigin: 'left' }}
            />
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-2">
          {blocks.map((block) => (
            <motion.div
              key={block.id}
              className={`p-2 rounded border ${
                block.isCurrent
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-border-subtle bg-bg-surface'
              }`}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-accent-primary">
                  #{block.id}
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {block.hash}
                </span>
              </div>
              <div className="font-mono text-xs text-text-secondary truncate">
                {block.section}
              </div>
              {block.isCurrent && (
                <motion.div
                  className="mt-1 h-0.5 bg-accent-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Chain visualization */}
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <div className="flex items-center justify-center gap-1">
            {blocks.slice(-5).map((block) => (
              <motion.div
                key={block.id}
                className={`w-3 h-3 rounded-sm ${
                  block.isCurrent ? 'bg-accent-primary' : 'bg-bg-elevated'
                }`}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ))}
            {blocks.length < 5 && 
              Array.from({ length: 5 - blocks.length }).map((_, i) => (
                <div key={`empty-${i}`} className="w-3 h-3 rounded-sm bg-bg-elevated/50 border border-dashed border-border-subtle" />
              ))
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}
