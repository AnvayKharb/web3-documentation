'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ClusterInfoCardProps {
  isVisible: boolean;
  title: string;
  description: string;
  slug: string;
  accentColor: string;
}

export default function ClusterInfoCard({
  isVisible,
  title,
  description,
  slug,
  accentColor,
}: ClusterInfoCardProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto"
          style={{
            background: '#0D0D14',
            border: `1px solid ${accentColor}`,
            borderRadius: '8px',
            padding: '12px 16px',
            minWidth: '180px',
            marginTop: '8px',
          }}
        >
          <h4
            style={{
              color: '#FFFFFF',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              marginBottom: '4px',
            }}
          >
            {title}
          </h4>
          <p
            style={{
              color: '#8888A0',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '11px',
              lineHeight: 1.4,
              marginBottom: '8px',
            }}
          >
            {description}
          </p>
          <Link
            href={`/docs/${slug}`}
            style={{
              color: accentColor,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            Read Docs →
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
