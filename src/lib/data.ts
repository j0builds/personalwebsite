import type { Project, Publication } from './types'

export const publications: Publication[] = [
  {
    id: 'cognitive-operator',
    title: 'The Cognitive Operator: A Mathematical Framework for Modeling Learning as Controlled State Evolution',
    authors: ['Joseph Ayinde', 'Keshav Saxena'],
    year: 2025,
    venue: 'Preprint',
    abstract:
      'Operator-theoretic framework modeling learning as controlled state evolution on structured cognitive space. Introduces spectral stability margins, multilayer Laplacian product geometry, Fokker-Planck density flow extensions, and a telemetry-to-control pipeline for adaptive tutoring systems.',
    tags: ['Operator Theory', 'Spectral Methods', 'Control Theory', 'Fokker-Planck'],
    featured: true,
  },
  {
    id: 'ml-cognition',
    title: 'From Algorithms to Understanding: Investigating Machine Learning\'s Influence on Human Cognitive Processing',
    authors: ['Joseph Ayinde', 'Keshav Saxena', 'Arnav Chatrathi'],
    year: 2025,
    venue: 'Celebration of Undergraduate Research, UNC Chapel Hill',
    abstract:
      'Poster presentation investigating the relationship between machine learning systems and human cognitive processing. Explores how algorithmic paradigms influence and reshape understanding in biological learning contexts.',
    tags: ['Machine Learning', 'Cognitive Science', 'Human-AI Interaction'],
  },
  {
    id: 'ai-ethics-neurosurgery',
    title: 'AI Ethics in Computational Neurosurgery',
    authors: ['Joseph Ayinde'],
    year: 2023,
    venue: 'Australian Institute of Health Innovation, Macquarie University',
    abstract:
      'Research on the legal and ethical implications of AI in neurosurgery, conducted under Prof. Antonio Di Ieva and Dr. Eric Suero-Molina at the world\'s first Computational Neurosurgery lab. Presented at the Australian Institute of Health Innovation.',
    tags: ['AI Ethics', 'Neurosurgery', 'Medical AI', 'Neuromodulation'],
  },
  {
    id: 'phenotypic-plasticity',
    title: 'Anticipatory Resource-Use Plasticity in Spadefoot Toad Tadpoles',
    authors: ['Joseph Ayinde'],
    year: 2024,
    venue: 'Pfennig Lab, UNC Biology (NSF-funded)',
    abstract:
      'Independent research on a $500K NSF project examining how developmental flexibility in response to environmental cues contributes to evolutionary diversification. Conducted Sanger sequencing, Next Generation Sequencing, gel electrophoresis, and DNA analysis.',
    tags: ['Evolutionary Biology', 'Genomics', 'NGS', 'Phenotypic Plasticity'],
  },
]

export const projects: Project[] = [
  {
    id: 'lamlab',
    title: 'The Learning and Memory Lab',
    description:
      'Building Lucy, an AI-native L&D platform for humans and machines — so your company becomes a system that learns and consolidates itself. Backed by angels from Stanford to the US Military. Affiliated with Founders, Inc. and The Residency (Sam Altman).',
    category: 'built',
    tags: ['AI', 'L&D', 'Memory', 'Enterprise', 'Neuroscience'],
    image: '/assets/images/cognition.jpg',
    link: 'https://lamlab.ai',
    external: true,
    featured: true,
  },
  {
    id: 'butterfly',
    title: 'Butterfly',
    description:
      'Desktop app that watches what you learn across your screen, builds a digital twin of your knowledge, and predicts what you are about to forget before you forget it. Built at Carnegie Mellon with the #1 learning science lab in the world.',
    category: 'built',
    tags: ['Electron', 'AI', 'Memory', 'Learning Science'],
    featured: false,
  },
  {
    id: 'tutr',
    title: 'Tutr',
    description:
      'The future of conversational learning. Neuroscience-grounded agentic tutoring delivered through SMS.',
    category: 'built',
    tags: ['AI', 'SMS', 'NLP', 'EdTech'],
    link: 'https://www.hellotutr.com/',
    external: true,
    featured: false,
  },
  {
    id: 'heally',
    title: 'HEALLY',
    description:
      'Early company that grew into a globally recognized learning platform with $150K+ in funding and world-class industry partnerships — the foundation for what became The Learning and Memory Lab.',
    category: 'built',
    tags: ['AI', 'EdTech', 'Machine Learning'],
    featured: false,
  },
]
