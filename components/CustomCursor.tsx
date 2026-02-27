'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'link' | 'button' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const onMouseMove = useCallback((event: MouseEvent) => {
    cursorX.set(event.clientX);
    cursorY.set(event.clientY);
    setIsVisible(true);
  }, [cursorX, cursorY]);

  const onMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Detect hoverable elements
    const handleElementHover = () => {
      const links = document.querySelectorAll('a, [data-cursor="link"]');
      const buttons = document.querySelectorAll('button, [data-cursor="button"]');
      const texts = document.querySelectorAll('input, textarea, [data-cursor="text"]');

      links.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorType('link'));
        el.addEventListener('mouseleave', () => setCursorType('default'));
      });

      buttons.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorType('button'));
        el.addEventListener('mouseleave', () => setCursorType('default'));
      });

      texts.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorType('text'));
        el.addEventListener('mouseleave', () => setCursorType('default'));
      });
    };

    handleElementHover();
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      observer.disconnect();
    };
  }, [onMouseMove, onMouseLeave, onMouseEnter]);

  const getCursorStyle = () => {
    switch (cursorType) {
      case 'link':
        return {
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          border: '2px solid rgba(79, 70, 229, 0.8)',
          mixBlendMode: 'difference' as const,
        };
      case 'button':
        return {
          width: 40,
          height: 40,
          borderRadius: '0%',
          backgroundColor: 'transparent',
          border: '2px solid #38BDF8',
          transform: 'rotate(45deg)',
        };
      case 'text':
        return {
          width: 4,
          height: 30,
          borderRadius: '2px',
          backgroundColor: '#38BDF8',
          border: 'none',
        };
      default:
        return {
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: '2px solid #38BDF8',
        };
    }
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[99999] flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          ...getCursorStyle(),
        }}
        transition={{ duration: 0.15 }}
      >
        {cursorType === 'button' && (
          <motion.div
            className="absolute w-2 h-2 bg-accent-primary"
            style={{ transform: 'rotate(-45deg)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Trailing dot */}
      <motion.div
        className="fixed pointer-events-none z-[99998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: 6,
          height: 6,
          backgroundColor: '#38BDF8',
          borderRadius: '50%',
        }}
      />

      {/* Cursor glow trail */}
      <motion.div
        className="fixed pointer-events-none z-[99997]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 0.15 : 0,
          width: 80,
          height: 80,
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
    </>
  );
}
