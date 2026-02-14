'use client'

import { motion } from 'framer-motion'

export function FavoriteToolCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -1 }}
      whileInView={{ opacity: 1, rotate: -1.5 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative"
    >
      {/* Scribble border SVG */}
      <svg
        className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none"
        viewBox="0 0 320 140"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M12 8 C40 3, 80 6, 140 5 C200 4, 260 2, 308 8 C314 20, 316 50, 312 80 C310 100, 313 120, 308 132 C270 136, 200 134, 140 135 C80 136, 40 138, 12 132 C6 120, 4 90, 8 60 C5 40, 7 20, 12 8Z"
          stroke="#D4A574"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 3"
          opacity="0.6"
        />
        <path
          d="M14 10 C50 5, 90 8, 145 6 C210 5, 255 4, 306 10 C312 25, 314 55, 310 82 C308 102, 311 118, 306 130 C265 135, 195 132, 142 133 C85 134, 45 136, 14 130 C8 118, 6 85, 10 58 C7 38, 9 22, 14 10Z"
          stroke="#D4A574"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>

      <div className="relative px-8 py-8 md:px-10 md:py-10 text-center">
        {/* Scribble arrow pointing down-left */}
        <svg
          className="absolute -top-8 -right-3 w-12 h-12"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M32 4 C28 8, 20 14, 14 22 C10 28, 8 32, 8 36"
            stroke="#D4A574"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M4 30 L8 36 L14 32"
            stroke="#D4A574"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>

        <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase mb-4">
          my favorite AI tool
        </p>

        {/* Claude logo */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M16.604 2.228a1.02 1.02 0 0 0-1.208 0L12 4.682 8.604 2.228a1.02 1.02 0 0 0-1.208 0L4.2 4.682A1.02 1.02 0 0 0 3.6 5.57v5.148c0 4.782 3.552 8.318 8.076 10.978a.68.68 0 0 0 .648 0C16.848 19.036 20.4 15.5 20.4 10.718V5.57a1.02 1.02 0 0 0-.6-.888z"
              fill="#D4A574"
              opacity="0.9"
            />
            <circle cx="9" cy="10" r="1.2" fill="white" />
            <circle cx="15" cy="10" r="1.2" fill="white" />
            <path
              d="M9.5 14c.8 1.2 2.2 1.8 3.5 1.5"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-2xl md:text-3xl font-mono font-medium text-neutral-800 tracking-tight">
            Claude Code
          </span>
        </div>

        <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
          this entire site was pair-programmed with Claude
        </p>
      </div>
    </motion.div>
  )
}
