'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Transaction {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  value: string;
}

interface Lightning {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export default function BackgroundMempool() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lightnings, setLightnings] = useState<Lightning[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const colors = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC'];

  const generateTransaction = useCallback((): Transaction => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: 100 + Math.random() * 10,
      size: Math.random() * 40 + 20,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      value: (Math.random() * 10).toFixed(4),
    };
  }, []);

  const generateLightning = useCallback((): Lightning => {
    const x1 = Math.random() * 100;
    const y1 = Math.random() * 100;
    return {
      id: Math.random().toString(36).substr(2, 9),
      x1,
      y1,
      x2: x1 + (Math.random() - 0.5) * 20,
      y2: y1 + (Math.random() - 0.5) * 20,
      opacity: 1,
    };
  }, []);

  useEffect(() => {
    // Initialize transactions
    const initialTxs = Array.from({ length: 20 }, generateTransaction);
    setTransactions(initialTxs);

    // Animation loop
    const animate = () => {
      setTransactions((prev) =>
        prev.map((tx) => {
          const newY = tx.y - tx.speed;
          if (newY < -10) {
            return generateTransaction();
          }
          return { ...tx, y: newY };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Lightning effect
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newLightning = generateLightning();
        setLightnings((prev) => [...prev.slice(-5), newLightning]);
        setTimeout(() => {
          setLightnings((prev) => prev.filter((l) => l.id !== newLightning.id));
        }, 150);
      }
    }, 500);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(lightningInterval);
    };
  }, [generateTransaction, generateLightning]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
        mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a12 100%)' }}
    >
      {/* Hexagonal grid */}
      <motion.div
        className="absolute inset-0 hex-grid opacity-30"
        style={{
          backgroundPosition: `${springX.get() * 0.1}px ${springY.get() * 0.1}px`,
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-accent-primary/3 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-accent-primary/3 via-transparent to-transparent" />

      {/* Floating transactions */}
      {transactions.map((tx) => (
        <motion.div
          key={tx.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${tx.x}%`,
            top: `${tx.y}%`,
            width: tx.size,
            height: tx.size,
            opacity: tx.opacity,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: `drop-shadow(0 0 10px ${tx.color})` }}
          >
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none"
              stroke={tx.color}
              strokeWidth="1"
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fill={tx.color}
              fontSize="16"
              fontFamily="var(--font-jetbrains)"
            >
              {tx.value}
            </text>
          </svg>
        </motion.div>
      ))}

      {/* Lightning connections */}
      <svg className="absolute inset-0 w-full h-full">
        {lightnings.map((lightning) => (
          <motion.line
            key={lightning.id}
            x1={`${lightning.x1}%`}
            y1={`${lightning.y1}%`}
            x2={`${lightning.x2}%`}
            y2={`${lightning.y2}%`}
            stroke="#4F46E5"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </svg>

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 8, 0.8) 100%)',
        }}
      />
    </div>
  );
}
