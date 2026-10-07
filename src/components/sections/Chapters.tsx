'use client'

import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { chapters } from '@/lib/data'
import type { Chapter } from '@/lib/types'
import { SectionHeading } from './SectionHeading'

function ChapterRow({
  chapter,
  index,
  active,
  onActive,
}: {
  chapter: Chapter
  index: number
  active: boolean
  onActive: (i: number) => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <li
      ref={ref}
      className={`border-t hairline py-12 transition-opacity duration-500 md:py-20 ${
        active ? 'opacity-100' : 'md:opacity-30'
      }`}
    >
      <p className="mb-4 flex items-baseline gap-4 font-mono text-xs tracking-[0.18em] text-paper/45 uppercase">
        <span className="font-display text-5xl tracking-normal text-paper normal-case md:hidden">
          {chapter.age}
        </span>
        <span className={chapter.age === 'Now' ? '' : 'hidden md:inline'}>
          {chapter.age === 'Now' ? 'Present' : `Age ${chapter.age}`}
        </span>
      </p>
      <h3 className="mb-4 font-display text-3xl leading-tight text-paper md:text-5xl">
        {chapter.title}
      </h3>
      <p className="max-w-xl text-base leading-relaxed text-paper/60 md:text-lg">{chapter.body}</p>
    </li>
  )
}

export function Chapters({ index = '02' }: { index?: string }) {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start center', 'end center'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const current = chapters[active]

  return (
    <section id="chapters" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index={index}
          label="Chapters"
          title={
            <>
              A life spent <span className="italic text-paper/70">learning</span> how we learn.
            </>
          }
          aside="From Greensboro, North Carolina. Dual citizen of the United States and Nigeria."
        />

        <div className="grid md:grid-cols-12 md:gap-6">
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-[22vh] flex h-[56vh] items-center">
              <div className="relative h-full w-px bg-paper/10">
                <motion.div
                  className="absolute top-0 left-0 w-px origin-top bg-signal"
                  style={{ scaleY: progress, height: '100%' }}
                />
              </div>
              <div className="relative ml-10 h-[14rem] flex-1 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={current.id}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 font-display text-[12rem] leading-[1.15] tracking-[-0.04em] text-paper"
                  >
                    {current.age}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <ol ref={listRef} className="md:col-span-7">
            {chapters.map((c, i) => (
              <ChapterRow
                key={c.id}
                chapter={c}
                index={i}
                active={active === i}
                onActive={setActive}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
