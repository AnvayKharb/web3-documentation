'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

interface CodeTerminalProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeTerminal({ 
  code, 
  language = 'solidity',
  title = 'contract.sol',
  showLineNumbers = true,
  className = ''
}: CodeTerminalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [, setIsDeploying] = useState(false);
  const [deployState, setDeployState] = useState<'idle' | 'deploying' | 'success'>('idle');

  useEffect(() => {
    if (isInView && !isTyping && displayedCode.length === 0) {
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index < code.length) {
          setDisplayedCode(code.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [isInView, code, isTyping, displayedCode.length]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeployState('deploying');
    
    // Simulate deployment
    setTimeout(() => {
      setDeployState('success');
      setTimeout(() => {
        setIsDeploying(false);
        setDeployState('idle');
      }, 3000);
    }, 2000);
  };

  const syntaxHighlight = (text: string) => {
    // Basic syntax highlighting
    const keywords = ['contract', 'function', 'public', 'private', 'view', 'returns', 'mapping', 'address', 'uint256', 'string', 'bool', 'event', 'emit', 'require', 'modifier', 'constructor', 'import', 'pragma', 'solidity', 'memory', 'storage', 'calldata', 'external', 'internal', 'payable', 'if', 'else', 'for', 'while', 'return'];
    // types array available for future use: ['uint', 'int', 'bytes', 'bytes32', 'address']

    let result = text;
    
    // Highlight strings
    result = result.replace(/"([^"]*)"/g, '<span class="text-accent-confirm">"$1"</span>');
    result = result.replace(/'([^']*)'/g, '<span class="text-accent-confirm">\'$1\'</span>');
    
    // Highlight comments
    result = result.replace(/(\/\/.*$)/gm, '<span class="text-text-muted">$1</span>');
    result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-text-muted">$1</span>');
    
    // Highlight keywords
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      result = result.replace(regex, '<span class="text-accent-primary">$1</span>');
    });
    
    // Highlight numbers
    result = result.replace(/\b(\d+)\b/g, '<span class="text-accent-warm">$1</span>');
    
    // Highlight function names
    result = result.replace(/(\w+)\s*\(/g, '<span class="text-text-primary">$1</span>(');

    return result;
  };

  const lines = displayedCode.split('\n');

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Matrix rain effect during deployment */}
      <AnimatePresence>
        {deployState === 'deploying' && (
          <motion.div
            className="absolute inset-0 z-30 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
              {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-accent-primary text-xs font-mono"
                style={{ left: `${i * 5}%` }}
                initial={{ y: '-100%' }}
                animate={{ y: '100vh' }}
                transition={{
                  duration: Math.random() * 1 + 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 0.5,
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <div key={j} style={{ opacity: Math.random() }}>
                    {String.fromCharCode(0x30A0 + Math.random() * 96)}
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success confetti */}
      <AnimatePresence>
        {deployState === 'success' && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{ 
                  y: '100vh', 
                  rotate: Math.random() * 720,
                  opacity: 0,
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  delay: Math.random() * 0.5,
                }}
              >
                {['◈', '♦', '⬡', '◆'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal window */}
      <div 
        className="relative rounded-lg border border-border-subtle bg-bg-surface/90 backdrop-blur-sm"
        style={{
          animation: deployState === 'deploying' ? 'shake 0.5s ease-in-out' : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-bg-elevated/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-xs text-text-secondary">{title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-xs text-accent-primary uppercase tracking-wider">
              {language}
            </span>
            <motion.button
              onClick={handleDeploy}
              disabled={deployState !== 'idle'}
              className="px-3 py-1 font-sans font-medium text-xs bg-accent-primary/10 border border-accent-primary/30 rounded text-accent-primary hover:bg-accent-primary/20 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="button"
            >
              {deployState === 'idle' && '▶ DEPLOY'}
              {deployState === 'deploying' && 'DEPLOYING...'}
              {deployState === 'success' && '✓ SUCCESS'}
            </motion.button>
          </div>
        </div>

        {/* Code area */}
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  {showLineNumbers && (
                    <span className="select-none w-8 text-text-muted text-right mr-4">
                      {i + 1}
                    </span>
                  )}
                  <span 
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }}
                    className="text-text-secondary"
                  />
                  {i === lines.length - 1 && isTyping && showCursor && (
                    <span className="inline-block w-2 h-5 bg-accent-primary ml-0.5 terminal-cursor" />
                  )}
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border-subtle bg-bg-elevated/30">
          <span className="font-mono text-xs text-text-muted">
            {isTyping ? 'Typing...' : `${lines.length} lines`}
          </span>
          <span className="font-mono text-xs text-accent-primary/50">
            UTF-8 | LF
          </span>
        </div>
      </div>
    </motion.div>
  );
}
