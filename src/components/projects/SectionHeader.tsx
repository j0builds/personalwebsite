'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  description: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="mb-10"
    >
      <h2 className="text-2xl font-mono tracking-tight text-neutral-900 mb-2">
        {title}
      </h2>
      <p className="text-sm text-neutral-400">{description}</p>
    </motion.div>
  )
}
