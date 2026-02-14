'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/components/shared/ScrollRevealText'

export function BioSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className="mb-20"
    >
      <h1 className="text-3xl md:text-4xl font-mono tracking-tight text-neutral-900 mb-8">
        About
      </h1>
      <div className="space-y-5 leading-relaxed">
        <ScrollRevealText
          className="text-neutral-500"
        >
          Joseph Ayinde is a polymath builder from Greensboro, North Carolina, a dual citizen of the United States and Nigeria. The work happens at the edges: the gap between biology and technology, the intersection of neuroscience and artificial intelligence, the bridge between what we know and what we are discovering.
        </ScrollRevealText>
        <ScrollRevealText
          className="text-neutral-500"
          highlightWords={{
            Cognition: 'text-neutral-700',
          }}
        >
          Previously co-founded Cognition (formerly HEALLY), the Cognitive OS for Learning. Prototyped and tested a non-invasive EEG-AI brain-computer interface, ran human-subject usability trials, and raised $150K+ with partners including Google DeepMind, NVIDIA, and Carnegie Mellon LearnLab.
        </ScrollRevealText>
        <ScrollRevealText
          className="text-neutral-500"
          highlightWords={{
            OpenAI: 'text-neutral-700',
          }}
        >
          At 21, joined OpenAI as a Member of Technical Staff, serving as a biology expert for next-generation large language models. Before that, became the world's first undergraduate intern in the world's first Computational Neurosurgery lab in Sydney, Australia, shadowing 80+ neurosurgical operations and leading a research project on AI ethics in neurosurgery under Prof. Antonio Di Ieva.
        </ScrollRevealText>
        <ScrollRevealText
          className="text-neutral-500"
          highlightWords={{
            Carnegie: 'text-neutral-700',
            Mellon: 'text-neutral-700',
            LearnLab: 'text-neutral-700',
          }}
        >
          Research spans operator theory for learning dynamics and evolutionary biology (NSF-funded, Pfennig Lab). Selected as a Computational Models of Learning Scholar at Carnegie Mellon LearnLab, the #1 learning science lab in the world.
        </ScrollRevealText>
        <ScrollRevealText
          className="text-neutral-500"
          highlightWords={{
            UNC: 'text-neutral-700',
            Chapel: 'text-neutral-700',
            Hill: 'text-neutral-700',
          }}
        >
          Arrived at UNC Chapel Hill at 18 as one of 25 students worldwide selected for the Chancellor's Science Scholars program. Graduated with honors in Biology, Neuroscience, and Chemistry.
        </ScrollRevealText>
      </div>
    </motion.section>
  )
}
