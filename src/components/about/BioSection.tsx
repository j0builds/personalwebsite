'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/components/shared/ScrollRevealText'
import { LamLogo } from '@/components/shared/LamLogo'

export function BioSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className="mb-20"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-3xl md:text-4xl font-mono tracking-tight text-neutral-900">
          About
        </h1>
        <a
          href="https://lamlab.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 transition-opacity duration-300"
        >
          <LamLogo
            variant="lockup"
            tone="dark"
            markClassName="h-9 w-9"
          />
        </a>
      </div>
      <div className="space-y-5 leading-relaxed">
        <ScrollRevealText className="text-neutral-500">
          Joseph Ayinde is a world-class scientist and builder from Greensboro, North Carolina — a dual citizen of the United States and Nigeria, now based in the San Francisco Bay Area. Polymath. Tar Heel.
        </ScrollRevealText>
        <ScrollRevealText
          className="text-neutral-500"
          highlightWords={{
            Learning: 'text-neutral-700',
            Memory: 'text-neutral-700',
            Lab: 'text-neutral-700',
            Lucy: 'text-neutral-700',
          }}
        >
          Now co-founder &amp; CEO of The Learning and Memory Lab, building Lucy — an AI-native L&amp;D platform for humans and machines. The company is backed by a vibrant group of angels, from Stanford to the US Military, and affiliated with Founders, Inc. and The Residency.
        </ScrollRevealText>
        <ScrollRevealText
          className="text-neutral-500"
          highlightWords={{
            HEALLY: 'text-neutral-700',
          }}
        >
          At 6, built a flashcard game on an Apple iPod and was aired on the local news. At 19, built HEALLY into a globally recognized company with over $150,000 in funding and world-class industry partnerships, and flew alone to Australia for a neurosurgical apprenticeship under Dr. Antonio Di Ieva and Dr. Eric Suero Molina.
        </ScrollRevealText>
        <ScrollRevealText
          className="text-neutral-500"
          highlightWords={{
            Carnegie: 'text-neutral-700',
            Mellon: 'text-neutral-700',
          }}
        >
          At 20, won a first international science award and a first national business award, and worked at Scale AI. At 21, researched through the NSF and US DOD. At 22, graduated from UNC Chapel Hill (May 2025) with degrees in Biology, Neuroscience, and Chemistry, then was selected as a Neuroscience and Machine Learning Scholar at Carnegie Mellon University.
        </ScrollRevealText>
        <ScrollRevealText className="text-neutral-500">
          The throughline is learning itself — how humans remember, how machines adapt, and how both get better together. That is what The Learning and Memory Lab is for.
        </ScrollRevealText>
      </div>
    </motion.section>
  )
}
