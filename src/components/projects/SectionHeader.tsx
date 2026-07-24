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
      <h2 className="mb-2 font-mono text-2xl tracking-tight text-[#141311]">
        {title}
      </h2>
      <p className="text-sm text-[#141311]/4">{description}</p>
    </motion.div>
  )
}
