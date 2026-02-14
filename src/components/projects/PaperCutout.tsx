'use client'

import { motion } from 'framer-motion'
import type { Publication } from '@/lib/types'

const rotations = [1.2, -0.8, 1.5, -1.1]

export function PaperCutout({
  publication,
  index = 0,
}: {
  publication: Publication
  index?: number
}) {
  const rotate = rotations[index % rotations.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotate * 0.5 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 0.6,
        delay: 0.3 + index * 0.12,
        ease: [0.25, 0.4, 0.25, 1] as const,
      }}
      className="relative"
    >
      <div
        className="relative bg-white rounded-sm px-7 py-7 md:px-9 md:py-8"
        style={{
          boxShadow:
            '2px 3px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
          fontFamily: '"Times New Roman", "Computer Modern", Georgia, serif',
        }}
      >
        {/* Top edge accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent" />

        {/* Title */}
        <h3
          className="text-sm md:text-base font-bold text-neutral-900 leading-snug mb-2.5 text-center"
          style={{ fontFamily: 'inherit' }}
        >
          {publication.title}
        </h3>

        {/* Authors */}
        <p className="text-[10px] md:text-[11px] text-neutral-600 text-center mb-3 tracking-wide">
          {publication.authors.join(' \u00B7 ')}
        </p>

        {/* Venue + year */}
        <p className="text-[9px] md:text-[10px] text-neutral-400 text-center mb-3 italic">
          {publication.venue}, {publication.year}
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-neutral-300 mx-auto mb-3" />

        {/* Abstract */}
        <div className="mb-3">
          <p
            className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-700 mb-1.5"
            style={{ fontFamily: 'inherit' }}
          >
            Abstract
          </p>
          <p
            className="text-[9px] md:text-[10px] text-neutral-600 leading-[1.7] text-justify"
            style={{ fontFamily: 'inherit' }}
          >
            {publication.abstract}
          </p>
        </div>

        {/* Keywords */}
        <p className="text-[8px] md:text-[9px] text-neutral-400 leading-relaxed">
          <span className="italic">Keywords:</span>{' '}
          {publication.tags.join(', ')}
        </p>

        {/* Corner fold */}
        <div
          className="absolute bottom-0 right-0 w-5 h-5"
          style={{
            background:
              'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.03) 50%)',
          }}
        />
      </div>
    </motion.div>
  )
}
