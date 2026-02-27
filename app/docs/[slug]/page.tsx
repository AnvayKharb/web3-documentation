'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { docSections, getDocBySlug, type DocSection } from '@/lib/web3-content';
import GlitchText from '@/components/GlitchText';
import BlockCard from '@/components/BlockCard';
import CodeTerminal from '@/components/CodeTerminal';
import Sidebar from '@/components/Sidebar';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const PageTransition = dynamic(() => import('@/components/PageTransition'), { ssr: false });
const BlockExplorer = dynamic(() => import('@/components/BlockExplorer'), { ssr: false });

export default function DocPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [doc, setDoc] = useState<DocSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay for dramatic effect
    const timer = setTimeout(() => {
      const foundDoc = getDocBySlug(slug);
      setDoc(foundDoc ?? null);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [slug]);

  const currentIndex = docSections.findIndex((s: DocSection) => s.slug === slug);
  const prevDoc = currentIndex > 0 ? docSections[currentIndex - 1] : null;
  const nextDoc = currentIndex < docSections.length - 1 ? docSections[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-accent-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GlitchText text="404" className="text-8xl font-sans font-bold text-accent-warm mb-4" />
          <p className="text-text-secondary font-mono mb-8">Block not found in the chain</p>
          <Link 
            href="/"
            className="px-6 py-3 bg-accent-primary text-white font-mono hover:bg-accent-primary/80 transition-colors"
          >
            Return to Genesis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <BlockExplorer />
      <div className="flex min-h-screen">
        <Sidebar />
        
        <main className="flex-1 lg:ml-72 py-12 px-6 lg:px-12">
          <motion.article
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto"
            data-section={doc.slug}
          >
            {/* Breadcrumb */}
            <motion.nav variants={fadeInUp} className="mb-8">
              <div className="flex items-center gap-2 text-sm font-mono text-text-muted">
                <Link href="/" className="hover:text-accent-primary transition-colors">HOME</Link>
                <span>/</span>
                <Link href="/docs/introduction" className="hover:text-accent-primary transition-colors">DOCS</Link>
                <span>/</span>
                <span className="text-accent-primary">{doc.title.toUpperCase()}</span>
              </div>
            </motion.nav>

            {/* Header */}
            <motion.header variants={fadeInUp} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{doc.icon}</span>
                <div>
                  <div className="text-xs font-mono text-accent-primary mb-2">
                    BLOCK #{currentIndex + 1} / {docSections.length}
                  </div>
                  <GlitchText 
                    text={doc.title} 
                    className="text-4xl md:text-5xl font-sans font-bold"
                  />
                </div>
              </div>
              <p className="text-xl text-text-secondary font-mono leading-relaxed">
                {doc.description}
              </p>
            </motion.header>

            {/* Key Points */}
            <motion.section variants={fadeInUp} className="mb-12">
              <BlockCard blockNumber={currentIndex + 1} className="bg-gradient-to-r from-accent-primary/5 to-accent-primary/3">
                <h2 className="text-lg font-sans font-bold text-accent-primary mb-4">
                  KEY CONCEPTS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doc.keyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" />
                      <span className="text-text-secondary font-mono text-sm">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </BlockCard>
            </motion.section>

            {/* Main Content */}
            <motion.section variants={fadeInUp} className="mb-12">
              <div className="prose prose-invert prose-indigo max-w-none">
                {doc.content.split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.05 }}
                    className="text-text-secondary leading-relaxed mb-6 font-mono text-sm"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.section>

            {/* Code Example */}
            {doc.codeExample && (
              <motion.section variants={fadeInUp} className="mb-12">
                <h2 className="text-2xl font-sans font-bold text-text-primary mb-6">
                  <span className="text-accent-warm">{'>'}</span> CODE EXAMPLE
                </h2>
                <CodeTerminal
                  code={doc.codeExample}
                  language={doc.slug === 'smart-contracts' ? 'solidity' : 'typescript'}
                  title={`${doc.slug}.${doc.slug === 'smart-contracts' ? 'sol' : 'ts'}`}
                />
              </motion.section>
            )}

            {/* Related Topics */}
            <motion.section variants={fadeInUp} className="mb-12">
              <h2 className="text-xl font-sans font-bold text-text-primary mb-6">
                RELATED PROTOCOLS
              </h2>
              <div className="flex flex-wrap gap-3">
                {doc.relatedTopics.map((topic, index) => {
                  const relatedDoc = docSections.find((s: DocSection) => 
                    s.title.toLowerCase().includes(topic.toLowerCase()) ||
                    topic.toLowerCase().includes(s.title.toLowerCase().split(' ')[0])
                  );
                  
                  return relatedDoc ? (
                    <Link
                      key={index}
                      href={`/docs/${relatedDoc.slug}`}
                      className="px-4 py-2 border border-border-subtle text-text-secondary hover:border-accent-primary 
                                 hover:text-accent-primary transition-all duration-300 font-mono text-sm"
                    >
                      {topic}
                    </Link>
                  ) : (
                    <span
                      key={index}
                      className="px-4 py-2 border border-border-subtle text-text-muted font-mono text-sm cursor-not-allowed"
                    >
                      {topic}
                    </span>
                  );
                })}
              </div>
            </motion.section>

            {/* Navigation */}
            <motion.nav 
              variants={fadeInUp}
              className="flex justify-between items-center pt-12 border-t border-border-subtle"
            >
              {prevDoc ? (
                <Link
                  href={`/docs/${prevDoc.slug}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <motion.span
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ←
                  </motion.span>
                  <div className="text-right">
                    <div className="text-xs font-mono opacity-50">PREVIOUS BLOCK</div>
                    <div className="font-sans font-medium">{prevDoc.title}</div>
                  </div>
                </Link>
              ) : <div />}

              {nextDoc ? (
                <Link
                  href={`/docs/${nextDoc.slug}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <div className="text-left">
                    <div className="text-xs font-mono opacity-50">NEXT BLOCK</div>
                    <div className="font-sans font-medium">{nextDoc.title}</div>
                  </div>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              ) : (
                <Link
                  href="/"
                  className="group flex items-center gap-3 text-accent-warm hover:text-accent-primary transition-colors"
                >
                  <div className="text-left">
                    <div className="text-xs font-mono opacity-50">COMPLETE</div>
                    <div className="font-sans font-medium">Return to Genesis</div>
                  </div>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⟳
                  </motion.span>
                </Link>
              )}
            </motion.nav>
          </motion.article>
        </main>
      </div>
    </PageTransition>
  );
}
