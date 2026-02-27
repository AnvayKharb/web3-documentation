'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

// Pixel fragment component
function PixelFragment({ 
  delay, 
  startX, 
  startY,
  isEnter 
}: { 
  delay: number; 
  startX: number; 
  startY: number;
  isEnter: boolean;
}) {
  const size = Math.random() * 20 + 5;
  const colors = ['#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: startX,
        top: startY,
        boxShadow: `0 0 ${size}px ${color}`,
      }}
      initial={isEnter ? { 
        x: (Math.random() - 0.5) * window.innerWidth * 2,
        y: (Math.random() - 0.5) * window.innerHeight * 2,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360,
      } : {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      animate={isEnter ? {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
      } : {
        x: (Math.random() - 0.5) * window.innerWidth * 2,
        y: (Math.random() - 0.5) * window.innerHeight * 2,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
}

const pageVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen"
      >
        {/* Pixel shatter effect overlay */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Generate pixel fragments */}
          {typeof window !== 'undefined' && Array.from({ length: 40 }).map((_, i) => (
            <PixelFragment
              key={i}
              delay={i * 0.01}
              startX={Math.random() * window.innerWidth}
              startY={Math.random() * window.innerHeight}
              isEnter={true}
            />
          ))}
        </motion.div>
        
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Simple wrapper for pages without the complex animation
export function SimpleFade({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
