'use client'

import { motion } from 'framer-motion'
import { experiences } from '@/lib/data'

export function ExperienceTimeline() {
  return (
    <section className="mb-20">
      <h2 className="text-xl font-mono tracking-tight text-neutral-700 mb-10">
        Experience
      </h2>
      <div className="space-y-0">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="grid grid-cols-[90px_1fr] md:grid-cols-[160px_1fr] gap-3 md:gap-4 py-5 border-b border-neutral-200 last:border-0"
          >
            <span className="text-xs font-mono text-neutral-400 pt-1">
              {exp.period}
            </span>
            <div>
              <h3 className="text-sm font-medium text-neutral-800 mb-1">
                {exp.role}
              </h3>
              <p className="text-sm text-neutral-500">{exp.organization}</p>
              {exp.description && (
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
