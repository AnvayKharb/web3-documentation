'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  glitchIntensity?: 'low' | 'medium' | 'high';
}

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function GlitchText({ 
  text, 
  className = '', 
  delay = 0,
  speed = 50,
  glitchIntensity = 'medium'
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0;
      const totalIterations = text.length;
      
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return char;
              }
              if (char === ' ') return ' ';
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join('')
        );

        if (iteration >= totalIterations) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }

        iteration += 1 / 3;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, delay, speed]);

  // Periodic glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  const getGlitchStyle = () => {
    const intensityValues = {
      low: { offset: 1, blur: 2 },
      medium: { offset: 2, blur: 4 },
      high: { offset: 4, blur: 6 },
    };
    
    const { offset } = intensityValues[glitchIntensity];
    
    if (!isGlitching) return {};
    
    return {
      textShadow: `
        ${offset}px 0 #E8A844,
        ${-offset}px 0 #38BDF8
      `,
      transform: `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`,
    };
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={getGlitchStyle()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
    >
      {displayText || text.split('').map(() => GLITCH_CHARS[0]).join('')}
    </motion.span>
  );
}

// Animated glitch title component
export function GlitchTitle({ 
  children, 
  className = '' 
}: { 
  children: string; 
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span 
        className="glitch-text" 
        data-text={children}
      >
        {children}
      </span>
    </div>
  );
}

// Hash display component
export function AnimatedHash({ length = 64 }: { length?: number }) {
  const [hash, setHash] = useState('');
  
  useEffect(() => {
    const generateHash = () => {
      const chars = '0123456789abcdef';
      let result = '0x';
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    };

    const interval = setInterval(() => {
      setHash(generateHash());
    }, 50);

    return () => clearInterval(interval);
  }, [length]);

  return (
    <motion.span 
      className="font-mono text-xs text-accent-primary/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {hash}
    </motion.span>
  );
}
