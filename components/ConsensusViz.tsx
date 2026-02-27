'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Miner {
  id: number;
  hashPower: number;
  progress: number;
  found: boolean;
}

interface Validator {
  id: number;
  stake: number;
  selected: boolean;
  isProposing: boolean;
}

type ConsensusType = 'pow' | 'pos';

export default function ConsensusViz({ type = 'pow' }: { type?: ConsensusType }) {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [winner, setWinner] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // Initialize nodes
  useEffect(() => {
    if (type === 'pow') {
      setMiners(
        Array.from({ length: 6 }, (_, i) => ({
          id: i,
          hashPower: Math.random() * 50 + 20,
          progress: 0,
          found: false,
        }))
      );
    } else {
      setValidators(
        Array.from({ length: 8 }, (_, i) => ({
          id: i,
          stake: Math.random() * 1000 + 100,
          selected: false,
          isProposing: false,
        }))
      );
    }
  }, [type]);

  // PoW simulation
  useEffect(() => {
    if (type !== 'pow' || !isRunning) return;

    const interval = setInterval(() => {
      setMiners((prev) => {
        const updated = prev.map((miner) => {
          if (miner.found) return miner;
          const newProgress = miner.progress + (miner.hashPower / 100) * (Math.random() * 10);
          if (newProgress >= 100) {
            setWinner(miner.id);
            setIsRunning(false);
            return { ...miner, progress: 100, found: true };
          }
          return { ...miner, progress: newProgress };
        });
        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [type, isRunning]);

  // PoS simulation
  const runPosRound = () => {
    setIsRunning(true);
    const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);
    const random = Math.random() * totalStake;
    let cumulative = 0;
    let selectedId = 0;

    for (const validator of validators) {
      cumulative += validator.stake;
      if (random <= cumulative) {
        selectedId = validator.id;
        break;
      }
    }

    // Animate selection
    let current = 0;
    const selectionInterval = setInterval(() => {
      setValidators((prev) =>
        prev.map((v) => ({
          ...v,
          selected: v.id === current,
          isProposing: false,
        }))
      );
      current++;
      if (current > selectedId) {
        clearInterval(selectionInterval);
        setValidators((prev) =>
          prev.map((v) => ({
            ...v,
            selected: v.id === selectedId,
            isProposing: v.id === selectedId,
          }))
        );
        setWinner(selectedId);
        setIsRunning(false);
      }
    }, 200);
  };

  const reset = () => {
    setWinner(null);
    setIsRunning(false);
    if (type === 'pow') {
      setMiners((prev) => prev.map((m) => ({ ...m, progress: 0, found: false })));
    } else {
      setValidators((prev) => prev.map((v) => ({ ...v, selected: false, isProposing: false })));
    }
  };

  if (type === 'pow') {
    return (
      <div className="card-surface rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sans font-medium text-sm text-accent-primary tracking-wider">
            PROOF OF WORK RACE
          </h3>
          <div className="flex gap-2">
            <motion.button
              onClick={() => { reset(); setIsRunning(true); }}
              disabled={isRunning}
              className="px-4 py-2 font-sans font-medium text-xs bg-accent-primary/10 border border-accent-primary/30 rounded text-accent-primary hover:bg-accent-primary/20 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRunning ? 'MINING...' : 'START MINING'}
            </motion.button>
            <motion.button
              onClick={reset}
              className="px-4 py-2 font-sans font-medium text-xs bg-text-muted/10 border border-border-subtle rounded text-text-secondary hover:bg-bg-elevated"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RESET
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          {miners.map((miner) => (
            <motion.div
              key={miner.id}
              className={`relative p-4 rounded-lg border ${
                miner.found
                  ? 'border-accent-confirm bg-accent-confirm/10'
                  : 'border-border-subtle bg-bg-surface'
              }`}
              onClick={() => setSelectedNode(miner.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      miner.found ? 'bg-accent-confirm' : 'bg-bg-elevated'
                    }`}
                    animate={isRunning && !miner.found ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                  >
                    <span className="font-mono text-xs text-text-primary">
                      {miner.found ? '✓' : `M${miner.id + 1}`}
                    </span>
                  </motion.div>
                  <div>
                    <span className="font-mono text-sm text-text-primary">
                      Miner {miner.id + 1}
                    </span>
                    <div className="font-mono text-xs text-text-muted">
                      {miner.hashPower.toFixed(1)} TH/s
                    </div>
                  </div>
                </div>
                <span className="font-mono text-sm text-accent-primary">
                  {miner.progress.toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    miner.found
                      ? 'bg-accent-confirm'
                      : 'bg-accent-primary'
                  }`}
                  style={{ width: `${miner.progress}%` }}
                />
              </div>

              {/* Hash visualization */}
              {isRunning && !miner.found && (
                <div className="mt-2 font-mono text-xs text-text-muted truncate">
                  {Array.from({ length: 20 })
                    .map(() => Math.random().toString(16).charAt(2))
                    .join('')}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {winner !== null && (
          <motion.div
            className="mt-6 p-4 rounded-lg bg-accent-confirm/10 border border-accent-confirm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-sans font-medium text-accent-confirm">
              MINER {winner + 1} FOUND THE BLOCK!
            </span>
          </motion.div>
        )}
      </div>
    );
  }

  // PoS visualization
  return (
    <div className="card-surface rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sans font-medium text-sm text-accent-primary tracking-wider">
          PROOF OF STAKE SELECTION
        </h3>
        <div className="flex gap-2">
          <motion.button
            onClick={() => { reset(); runPosRound(); }}
            disabled={isRunning}
            className="px-4 py-2 font-sans font-medium text-xs bg-accent-primary/10 border border-accent-primary/30 rounded text-accent-primary hover:bg-accent-primary/20 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? 'SELECTING...' : 'SELECT VALIDATOR'}
          </motion.button>
          <motion.button
            onClick={reset}
            className="px-4 py-2 font-sans font-medium text-xs bg-text-muted/10 border border-border-subtle rounded text-text-secondary hover:bg-bg-elevated"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RESET
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {validators.map((validator) => {
          const maxStake = Math.max(...validators.map((v) => v.stake));
          return (
            <motion.div
              key={validator.id}
              className={`relative p-4 rounded-lg border text-center ${
                validator.isProposing
                  ? 'border-accent-confirm bg-accent-confirm/10'
                  : validator.selected
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-border-subtle bg-bg-surface'
              }`}
              animate={{
                scale: validator.selected ? 1.1 : 1,
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedNode(validator.id)}
            >
              <motion.div
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  validator.isProposing
                    ? 'bg-accent-confirm'
                    : 'bg-accent-primary'
                }`}
                style={{
                  transform: `scale(${0.8 + (validator.stake / maxStake) * 0.4})`,
                }}
                animate={validator.selected ? { rotate: 360 } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="font-mono text-xs text-white">
                  V{validator.id + 1}
                </span>
              </motion.div>
              <div className="font-mono text-sm text-text-primary">
                {validator.stake.toFixed(0)} ETH
              </div>
              {validator.isProposing && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-confirm flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-xs">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {winner !== null && (
        <motion.div
          className="mt-6 p-4 rounded-lg bg-accent-confirm/10 border border-accent-confirm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-sans font-medium text-accent-confirm">
            VALIDATOR {winner + 1} SELECTED TO PROPOSE!
          </span>
        </motion.div>
      )}

      {/* Node details panel */}
      <AnimatePresence>
        {selectedNode !== null && (
          <motion.div
            className="mt-4 p-4 rounded-lg bg-bg-surface border border-border-subtle"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans font-medium text-xs text-accent-primary">
                VALIDATOR {selectedNode + 1} DETAILS
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 font-mono text-sm">
              <div>
                <span className="text-text-muted">Stake:</span>
                <span className="ml-2 text-accent-primary">
                  {validators[selectedNode]?.stake.toFixed(2)} ETH
                </span>
              </div>
              <div>
                <span className="text-text-muted">Probability:</span>
                <span className="ml-2 text-accent-primary">
                  {(
                    (validators[selectedNode]?.stake /
                      validators.reduce((sum, v) => sum + v.stake, 0)) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
