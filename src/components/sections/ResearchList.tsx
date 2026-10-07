'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { publications } from '@/lib/data'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from './SectionHeading'

export function ResearchList({ index = '04' }: { index?: string }) {
  const [open, setOpen] = useState<string | null>(publications[0]?.id ?? null)

  return (
    <section id="research" className="px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index={index}
          label="Research"
          title={
            <>
              Neuroscience, AI &amp; the <span className="italic text-paper/70">mathematics</span> of
              learning.
            </>
          }
          aside="Publications and lab work — from computational neurosurgery to operator theory."
        />

        <ol className="border-b hairline">
          {publications.map((pub, i) => {
            const isOpen = open === pub.id
            const panelId = `pub-${pub.id}`
            return (
              <Reveal as="li" key={pub.id} delay={i * 0.06} y={16} className="border-t hairline">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : pub.id)}
                  className="group grid w-full grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 py-8 text-left md:grid-cols-12 md:gap-6"
                >
                  <span className="font-mono text-xs text-paper/40 md:col-span-1">{pub.year}</span>
                  <span className="font-display text-2xl leading-tight text-paper/90 transition-colors group-hover:text-paper md:col-span-7 md:text-4xl">
                    {pub.title}
                  </span>
                  <span className="hidden text-sm text-paper/45 md:col-span-3 md:block">
                    {pub.venue}
                  </span>
                  <span
                    aria-hidden
                    className={`grid h-8 w-8 place-items-center rounded-full border text-paper/60 transition-all duration-500 md:col-span-1 md:justify-self-end ${
                      isOpen ? 'rotate-45 border-signal text-signal' : 'border-paper/15'
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-10 md:grid-cols-12">
                        <div className="md:col-span-7 md:col-start-2">
                          <p className="mb-2 text-sm text-paper/45 md:hidden">{pub.venue}</p>
                          <p className="mb-4 font-mono text-xs text-paper/45">
                            {pub.authors.map((a, j) => (
                              <span key={a}>
                                <span className={a === 'Joseph Ayinde' ? 'text-paper/85' : ''}>
                                  {a}
                                </span>
                                {j < pub.authors.length - 1 && ' · '}
                              </span>
                            ))}
                          </p>
                          <p className="leading-relaxed text-paper/60">{pub.abstract}</p>
                        </div>
                        <ul className="flex flex-wrap content-start gap-2 md:col-span-3 md:col-start-9">
                          {pub.tags.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-paper/12 px-3 py-1 font-mono text-[11px] text-paper/50"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
