'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Publication } from '@/lib/types'

interface ResearchCardProps {
  publication: Publication
  index: number
}

export function ResearchCard({ publication, index }: ResearchCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      onClick={() => setExpanded(!expanded)}
      className="group relative pl-6 py-5 cursor-pointer border-l border-neutral-200 hover:border-brand-green transition-colors duration-500"
    >
      {/* Year pill */}
      <span className="inline-block text-[10px] font-mono tracking-widest text-neutral-400 border border-neutral-200 rounded-full px-2.5 py-0.5 mb-3 group-hover:border-neutral-300 group-hover:text-neutral-500 transition-colors duration-300">
        {publication.year}
      </span>

      {/* Title */}
      <h3 className="text-base md:text-lg font-medium text-neutral-800 leading-snug mb-2 group-hover:text-neutral-900 transition-colors duration-300">
        {publication.link ? (
          <a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline underline-offset-4 decoration-neutral-300"
          >
            {publication.title}
          </a>
        ) : (
          publication.title
        )}
      </h3>

      {/* Authors + Venue (citation style) */}
      <p className="text-xs md:text-sm text-neutral-400 mb-3 font-mono tracking-tight">
        {publication.authors.map((author, i) => (
          <span key={author}>
            <span className={author === 'Joseph Ayinde' ? 'text-neutral-600 font-medium' : ''}>
              {author}
            </span>
            {i < publication.authors.length - 1 && ', '}
          </span>
        ))}
        <br className="md:hidden" />
        <span className="hidden md:inline mx-2 text-neutral-300">|</span>
        <span className="italic text-neutral-400">{publication.venue}</span>
      </p>

      {/* Abstract (expandable) */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 44 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        className="overflow-hidden relative"
      >
        <p className="text-sm text-neutral-500 leading-relaxed">
          {publication.abstract}
        </p>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none" />
        )}
      </motion.div>

      {/* Expand indicator */}
      <span className="inline-block text-[10px] text-neutral-300 mt-2 group-hover:text-neutral-400 transition-colors">
        {expanded ? 'collapse' : 'read abstract'}
      </span>

      {/* Tags as academic keywords */}
      <div className="flex flex-wrap gap-2 mt-3">
        {publication.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-mono text-neutral-400 group-hover:text-neutral-500 transition-colors duration-300"
          >
            [{tag}]
          </span>
        ))}
      </div>
    </motion.article>
  )
}
