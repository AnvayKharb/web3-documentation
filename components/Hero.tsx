'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import GlitchText from './GlitchText';
import Link from 'next/link';

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false });

const ticker = [
  'BLOCKCHAIN',
  'DECENTRALIZED',
  'SMART CONTRACTS',
  'PROOF OF STAKE',
  'ZERO KNOWLEDGE',
  'LAYER 2',
  'DEFI',
  'DAO',
  'NFT',
  'WEB3',
  'CONSENSUS',
  'MERKLE TREE',
  'CRYPTOGRAPHY',
  'TOKENOMICS',
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const [miningHash, setMiningHash] = useState('');
  const [blockNumber, setBlockNumber] = useState(18291847);
  const [nonce, setNonce] = useState(0);

  // Mining simulation
  useEffect(() => {
    const miningInterval = setInterval(() => {
      const chars = '0123456789abcdef';
      let hash = '0x';
      for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      setMiningHash(hash);
      setNonce((prev) => prev + Math.floor(Math.random() * 1000));
    }, 50);

    const blockInterval = setInterval(() => {
      setBlockNumber((prev) => prev + 1);
      setNonce(0);
    }, 12000);

    return () => {
      clearInterval(miningInterval);
      clearInterval(blockInterval);
    };
  }, []);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ opacity }}
    >
      {/* 3D Particle Background */}
      <ParticleField />

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4"
        style={{ y }}
      >
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <span className="font-sans font-medium text-accent-primary text-sm tracking-[0.2em] uppercase">
            The Genesis Block
          </span>
        </motion.div>

        {/* Main Title with Glitch */}
        <motion.h1
          className="hero-h1 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="block text-text-primary">
            <GlitchText text="WEB3" delay={500} speed={40} glitchIntensity="high" />
          </span>
          <span className="block text-accent-primary">
            <GlitchText text="PROTOCOL" delay={800} speed={40} glitchIntensity="high" />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-sans font-normal text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <GlitchText 
            text="The complete documentation for the decentralized future" 
            delay={1200} 
            speed={20}
            glitchIntensity="low"
          />
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Link href="/docs/introduction">
            <motion.button
              className="group relative px-8 py-4 font-sans font-medium text-sm tracking-wider uppercase overflow-hidden bg-accent-primary text-white rounded-lg"
              whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.98 }}
              data-cursor="button"
            >
              <span className="relative z-10">Enter the Chain</span>
            </motion.button>
          </Link>
          
          <Link href="/docs/blockchain">
            <motion.button
              className="group relative px-8 py-4 font-sans font-medium text-sm tracking-wider uppercase border border-border-default text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor="button"
            >
              <span className="relative z-10">View Documentation</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Mining Visualization */}
        <motion.div
          className="card-surface p-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans font-light text-xs text-text-muted tracking-wider uppercase">MINING BLOCK</span>
            <span className="font-mono text-sm text-accent-primary">#{blockNumber}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted">HASH:</span>
              <span className="font-mono text-xs text-text-secondary truncate flex-1">
                {miningHash}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted">NONCE:</span>
              <span className="font-mono text-xs text-text-secondary">{nonce.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-bg-elevated rounded-full overflow-hidden mt-4">
              <motion.div
                className="h-full bg-accent-primary"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ticker */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 py-4 overflow-hidden border-t border-border-subtle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="flex whitespace-nowrap animate-ticker"
          animate={{ x: [0, -50 * ticker.length] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              className="font-sans font-medium text-sm text-text-muted mx-8 tracking-widest"
            >
              {item}
              <span className="mx-4 text-accent-primary">◆</span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-border-default rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 bg-accent-primary rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
