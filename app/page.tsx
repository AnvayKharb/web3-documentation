'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { docSections } from '@/lib/web3-content';
import GlitchText from '@/components/GlitchText';
import BlockCard from '@/components/BlockCard';
import { staggerContainer, fadeInUp, scaleUp } from '@/lib/animations';

const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const ConsensusViz = dynamic(() => import('@/components/ConsensusViz'), { ssr: false });
const KnowledgeGraph = dynamic(() => import('@/components/KnowledgeGraph'), { ssr: false });
const GlossarySearch = dynamic(() => import('@/components/GlossarySearch'), { ssr: false });
const BlockExplorer = dynamic(() => import('@/components/BlockExplorer'), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      <BlockExplorer />
      
      {/* Hero Section */}
      <Hero />

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-accent-primary/50 text-xs font-mono uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-accent-primary to-transparent" />
        </motion.div>
      </motion.div>

      {/* Documentation Sections Preview */}
      <section className="relative py-32 px-8" data-section="docs-preview">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <GlitchText 
              text="PROTOCOL DOCUMENTATION" 
              className="text-4xl md:text-6xl font-sans font-bold mb-6"
            />
            <p className="text-text-secondary max-w-2xl mx-auto font-mono text-sm">
              Comprehensive guides to understanding the decentralized stack. 
              Each section is a building block towards Web3 mastery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.slice(0, 6).map((section, index) => (
              <motion.div
                key={section.slug}
                variants={scaleUp}
                custom={index}
              >
                <Link href={`/docs/${section.slug}`}>
                  <BlockCard blockNumber={index + 1} className="h-full group">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{section.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-sans font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-text-secondary text-sm mt-2 line-clamp-2">
                          {section.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {section.keyPoints.slice(0, 2).map((point, i) => (
                            <span 
                              key={i}
                              className="text-xs px-2 py-1 bg-accent-primary/10 text-accent-primary rounded font-mono"
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </BlockCard>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link 
              href="/docs/introduction"
              className="inline-flex items-center gap-3 px-8 py-4 border border-accent-primary text-accent-primary 
                         hover:bg-accent-primary hover:text-white transition-all duration-300 font-mono
                         relative overflow-hidden group"
            >
              <span className="relative z-10">EXPLORE ALL DOCUMENTATION</span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
              <div className="absolute inset-0 bg-accent-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Consensus Visualization */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-transparent via-accent-primary/5 to-transparent" data-section="consensus">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <GlitchText 
              text="CONSENSUS MECHANISMS" 
              className="text-4xl md:text-5xl font-sans font-bold mb-6"
            />
            <p className="text-text-secondary max-w-2xl mx-auto font-mono text-sm">
              Watch how distributed networks achieve agreement. 
              Interact with live simulations of Proof of Work and Proof of Stake.
            </p>
          </div>
          <ConsensusViz />
        </motion.div>
      </section>

      {/* Knowledge Graph */}
      <section className="relative py-32 px-8" data-section="knowledge-graph">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <GlitchText 
              text="KNOWLEDGE GRAPH" 
              className="text-4xl md:text-5xl font-sans font-bold mb-6"
            />
            <p className="text-text-secondary max-w-2xl mx-auto font-mono text-sm">
              Explore the interconnected Web3 ecosystem. 
              Drag nodes to navigate, click to dive deeper.
            </p>
          </div>
          <KnowledgeGraph />
        </motion.div>
      </section>

      {/* Glossary */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-transparent via-accent-warm/5 to-transparent" data-section="glossary">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <GlitchText 
              text="PROTOCOL GLOSSARY" 
              className="text-4xl md:text-5xl font-sans font-bold mb-6"
            />
            <p className="text-text-secondary max-w-2xl mx-auto font-mono text-sm">
              Decode the terminology of the decentralized world. 
              Search to decrypt definitions.
            </p>
          </div>
          <GlossarySearch />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-8 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-sans font-bold text-accent-primary mb-2">
                WEB3 PROTOCOL
              </h3>
              <p className="text-text-muted font-mono text-sm">
                Building the decentralized future, one block at a time.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {docSections.slice(0, 5).map((section) => (
                <Link
                  key={section.slug}
                  href={`/docs/${section.slug}`}
                  className="text-text-secondary hover:text-accent-primary transition-colors font-mono text-sm"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border-subtle text-center">
            <p className="text-text-muted font-mono text-xs">
              <span className="text-accent-primary">{'<'}</span>
              BLOCK #{Math.floor(Date.now() / 1000)}
              <span className="text-accent-primary">{'>'}</span>
              {' // '}
              TIMESTAMP: {new Date().toISOString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

