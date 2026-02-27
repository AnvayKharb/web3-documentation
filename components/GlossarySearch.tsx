'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const glossaryTerms: GlossaryTerm[] = [
  { term: 'Blockchain', definition: 'A distributed, immutable ledger that records transactions across a network of computers', category: 'Core' },
  { term: 'Smart Contract', definition: 'Self-executing code deployed on a blockchain that automatically enforces agreements', category: 'Core' },
  { term: 'DeFi', definition: 'Decentralized Finance - financial services built on blockchain without intermediaries', category: 'Application' },
  { term: 'DAO', definition: 'Decentralized Autonomous Organization - community-governed entity with rules encoded in smart contracts', category: 'Governance' },
  { term: 'NFT', definition: 'Non-Fungible Token - unique digital asset representing ownership of items like art or collectibles', category: 'Token' },
  { term: 'Gas', definition: 'Fee paid to compensate for computational resources required to process transactions', category: 'Core' },
  { term: 'Merkle Tree', definition: 'Data structure that efficiently verifies data integrity using cryptographic hashes', category: 'Cryptography' },
  { term: 'Consensus', definition: 'Mechanism by which network participants agree on the state of the blockchain', category: 'Core' },
  { term: 'Validator', definition: 'Node that participates in consensus by validating and proposing blocks', category: 'Core' },
  { term: 'Liquidity Pool', definition: 'Smart contract containing token reserves that enable decentralized trading', category: 'DeFi' },
  { term: 'Impermanent Loss', definition: 'Temporary loss when providing liquidity due to price divergence of pooled tokens', category: 'DeFi' },
  { term: 'Flash Loan', definition: 'Uncollateralized loan that must be borrowed and repaid within a single transaction', category: 'DeFi' },
  { term: 'Rollup', definition: 'Layer 2 scaling solution that bundles transactions and posts data to Layer 1', category: 'Scaling' },
  { term: 'ZK Proof', definition: 'Cryptographic method to prove knowledge without revealing the information itself', category: 'Cryptography' },
  { term: 'Account Abstraction', definition: 'Protocol upgrade allowing smart contract wallets with flexible authentication', category: 'Infrastructure' },
  { term: 'MEV', definition: 'Maximal Extractable Value - profit extracted by reordering or inserting transactions', category: 'Core' },
  { term: 'Oracle', definition: 'Service that provides external data to smart contracts on-chain', category: 'Infrastructure' },
  { term: 'Staking', definition: 'Locking tokens to participate in consensus and earn rewards', category: 'Core' },
  { term: 'Slashing', definition: 'Penalty for validator misbehavior resulting in loss of staked tokens', category: 'Core' },
  { term: 'Finality', definition: 'State when a transaction is irreversible and permanently recorded', category: 'Core' },
];

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function DecryptText({ text, isVisible }: { text: string; isVisible: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    if (isVisible && !isDecrypting) {
      setIsDecrypting(true);
      let iteration = 0;
      
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) return char;
              if (char === ' ') return ' ';
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1;
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isVisible, text, isDecrypting]);

  return <span>{displayText}</span>;
}

export default function GlossarySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>(glossaryTerms);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery) {
      const filtered = glossaryTerms.filter(
        (term) =>
          term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTerms(filtered);
      setShowResults(true);
    } else {
      setFilteredTerms(glossaryTerms);
      setShowResults(true);
    }
  }, [searchQuery]);

  const categoryColors: Record<string, string> = {
    Core: '#4F46E5',
    Application: '#E8A844',
    DeFi: '#6366F1',
    Cryptography: '#22C55E',
    Governance: '#818CF8',
    Token: '#A5B4FC',
    Infrastructure: '#4F46E5',
    Scaling: '#6366F1',
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-8">
        <motion.div
          className={`relative rounded-lg overflow-hidden ${
            isFocused ? 'ring-2 ring-accent-primary' : ''
          }`}
          animate={{
            boxShadow: isFocused
              ? '0 0 20px rgba(79, 70, 229, 0.2)'
              : '0 0 0px transparent',
          }}
        >
          {/* Scanline effect */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-px bg-accent-primary/30"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center bg-bg-surface border border-border-subtle rounded-lg">
            <div className="pl-4 text-accent-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search the decode terminal..."
              className="w-full px-4 py-4 bg-transparent font-mono text-text-primary placeholder-text-muted focus:outline-none"
              data-cursor="text"
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                className="pr-4 text-text-muted hover:text-text-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-2 px-2">
          <span className="font-mono text-xs text-text-muted">
            {filteredTerms.length} terms found
          </span>
          <span className="font-sans font-medium text-xs text-accent-primary tracking-wider">
            DECODE TERMINAL v1.0
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredTerms.map((term, index) => (
            <motion.div
              key={term.term}
              layout
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="perspective-1000"
            >
              <motion.div
                className={`relative h-48 cursor-pointer preserve-3d transition-transform duration-500 ${
                  flippedCard === term.term ? 'rotate-y-180' : ''
                }`}
                onClick={() =>
                  setFlippedCard(flippedCard === term.term ? null : term.term)
                }
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCard === term.term ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 card-surface rounded-lg p-4 backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-sans font-medium"
                      style={{
                        backgroundColor: `${categoryColors[term.category]}20`,
                        color: categoryColors[term.category],
                      }}
                    >
                      {term.category}
                    </span>
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: categoryColors[term.category] }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <h3 className="font-sans font-semibold text-xl text-text-primary mb-2">
                    <DecryptText text={term.term} isVisible={showResults} />
                  </h3>
                  
                  <p className="font-mono text-xs text-text-secondary line-clamp-3">
                    {term.definition.substring(0, 80)}...
                  </p>

                  <div className="absolute bottom-4 right-4 text-accent-primary/50 text-xs font-mono">
                    FLIP →
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 card-surface rounded-lg p-4 backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="h-full flex flex-col">
                    <h4 className="font-sans font-medium text-sm text-accent-primary mb-3 tracking-wider">
                      DEFINITION
                    </h4>
                    <p className="font-mono text-sm text-text-secondary flex-1">
                      {term.definition}
                    </p>
                    <div className="text-accent-primary/50 text-xs font-mono">
                      ← FLIP BACK
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No results */}
      {filteredTerms.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="font-sans font-semibold text-2xl text-text-muted mb-2">
            NO MATCHES FOUND
          </div>
          <p className="font-mono text-sm text-text-muted">
            Try searching for a different term
          </p>
        </motion.div>
      )}
    </div>
  );
}
