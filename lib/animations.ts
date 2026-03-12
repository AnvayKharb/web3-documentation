import { Variants } from 'framer-motion';

// Stagger container for children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

// Fade up animation for list items
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -40,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 40,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Scale up animation
export const scaleUp: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Glitch effect animation
export const glitchVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 0,
  },
  visible: { 
    opacity: 1,
    x: [0, -2, 2, -2, 0],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  glitch: {
    x: [0, -5, 5, -5, 5, 0],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(-90deg)',
      'hue-rotate(0deg)',
    ],
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

// Pulse glow animation
export const pulseGlow: Variants = {
  initial: {
    boxShadow: '0 0 0px rgba(0, 255, 255, 0)',
  },
  animate: {
    boxShadow: [
      '0 0 10px rgba(0, 255, 255, 0.3)',
      '0 0 30px rgba(0, 255, 255, 0.6)',
      '0 0 10px rgba(0, 255, 255, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Floating animation
export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Card hover effect
export const cardHover: Variants = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide in variations
export const slideInVariants = {
  fromTop: {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  },
  fromBottom: {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  },
  fromLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  },
  fromRight: {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  },
};

// Text reveal character by character
export const textReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const letterVariant: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    rotateX: -90,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Shatter effect for page exit
export const shatterVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: [-500, 500][Math.floor(Math.random() * 2)],
    y: [-500, 500][Math.floor(Math.random() * 2)],
    rotate: 180,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Spring configurations
export const springConfig = {
  gentle: { stiffness: 100, damping: 20 },
  snappy: { stiffness: 400, damping: 25 },
  bouncy: { stiffness: 600, damping: 15 },
  slow: { stiffness: 50, damping: 20 },
  wobbly: { stiffness: 180, damping: 12 },
};

// Preset viewport options
export const viewportOptions = {
  once: { once: true, margin: '-100px' },
  always: { once: false, margin: '-50px' },
  eager: { once: true, margin: '0px' },
};
