'use client'

import { motion } from 'framer-motion'
import { SOCIAL_LINKS } from '@/lib/constants'

export function ContactSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-xl font-mono tracking-tight text-neutral-700 mb-6">
        Connect
      </h2>
      <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
        Building The Learning and Memory Lab in SF. Always open to founders,
        operators, investors, and HR / L&amp;D leaders who care about how
        humans and machines learn together.
      </p>
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        <a
          href={`mailto:${SOCIAL_LINKS.email}`}
          className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors duration-300 underline underline-offset-4 decoration-neutral-300"
        >
          email
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors duration-300 underline underline-offset-4 decoration-neutral-300"
        >
          linkedin
        </a>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors duration-300 underline underline-offset-4 decoration-neutral-300"
        >
          github
        </a>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors duration-300 underline underline-offset-4 decoration-neutral-300"
        >
          instagram
        </a>
      </div>
    </motion.section>
  )
}
