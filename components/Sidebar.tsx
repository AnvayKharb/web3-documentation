'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

const navItems = [
  { title: 'Introduction', slug: 'introduction', icon: '◈' },
  { title: 'Blockchain Fundamentals', slug: 'blockchain', icon: '⬡' },
  { title: 'Consensus Mechanisms', slug: 'consensus', icon: '◉' },
  { title: 'Smart Contracts', slug: 'smart-contracts', icon: '⟐' },
  { title: 'DeFi Architecture', slug: 'defi', icon: '◇' },
  { title: 'Layer 2 Scaling', slug: 'layer2', icon: '⧈' },
  { title: 'Zero-Knowledge Proofs', slug: 'zk-proofs', icon: '∅' },
  { title: 'Tokenomics', slug: 'tokenomics', icon: '◆' },
  { title: 'DAOs', slug: 'daos', icon: '⬢' },
  { title: 'Wallet Infrastructure', slug: 'wallets', icon: '⬣' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [, setActiveIndex] = useState(0);

  const springConfig = { stiffness: 400, damping: 30 };
  const indicatorY = useSpring(0, springConfig);

  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => pathname === `/docs/${item.slug}`
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      indicatorY.set(currentIndex * 48);
    }
  }, [pathname, indicatorY]);

  return (
    <>
      {/* Mobile toggle */}
      <motion.button
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 card-surface flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        data-cursor="button"
      >
        <motion.div className="flex flex-col gap-1.5">
          <motion.span
            className="w-6 h-0.5 bg-accent-primary block"
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-accent-primary block"
            animate={{ opacity: isOpen ? 0 : 1 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-accent-primary block"
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
          />
        </motion.div>
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-72 bg-bg-surface/95 backdrop-blur-xl border-r border-border-subtle z-40 transform transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        animate={{ scale: [1, 1.002, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <Link href="/" onClick={() => setIsOpen(false)}>
          <motion.div
            className="px-6 py-8 border-b border-border-subtle"
            whileHover={{ scale: 1.02 }}
          >
            <h1 className="font-sans font-bold text-3xl text-text-primary">
              WEB<span className="text-accent-primary">3</span>
            </h1>
            <p className="font-sans font-light text-xs text-text-muted tracking-widest mt-1">
              DOCUMENTATION
            </p>
          </motion.div>
        </Link>

        {/* Navigation */}
        <nav className="px-4 py-6 relative">
          {/* Active indicator */}
          <motion.div
            className="absolute left-0 w-0.5 h-10 bg-accent-primary rounded-r-full"
            style={{ y: indicatorY, top: '24px' }}
          />

          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === `/docs/${item.slug}`;
              const isHovered = hoveredIndex === index;

              return (
                <motion.li
                  key={item.slug}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  animate={{
                    x: isHovered && !isActive ? (Math.random() - 0.5) * 2 : 0,
                    y: isHovered && !isActive ? (Math.random() - 0.5) * 2 : 0,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <Link
                    href={`/docs/${item.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-accent-primary/10 text-text-primary border-l-2 border-accent-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.span
                        className={`text-lg ${isActive ? 'text-accent-primary' : 'text-text-muted'}`}
                        animate={isActive ? { 
                          rotate: [0, 360],
                        } : {}}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="font-sans font-medium text-sm">{item.title}</span>
                    </motion.div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-muted">v1.0.0</span>
            <div className="flex gap-3">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-primary transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                data-cursor="link"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-primary transition-colors"
                whileHover={{ scale: 1.1, rotate: -5 }}
                data-cursor="link"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
