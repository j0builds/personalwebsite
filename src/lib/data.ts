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
    id: 'cognition',
    title: 'Cognition: The Cognitive OS',
    description:
      "The world's first Social Intelligence Network. A drop-in intelligence layer that transforms any software into a living system that converses, remembers, and reinforces growth. Prototyped and tested a non-invasive EEG-AI brain-computer interface with human-subject usability testing. $150K+ raised; partners include Google DeepMind, NVIDIA, CMU LearnLab.",
    category: 'built',
    tags: ['Next.js', 'TypeScript', 'AI', 'EEG', 'BCI', 'Python'],
    image: '/assets/images/cognition.jpg',
    link: 'https://cognitionus.com',
    external: true,
    featured: true,
  },
  {
    id: 'heally',
    title: 'HEALLY',
    description:
      'An AI-powered learning ecosystem. Personalized education platform leveraging machine learning to adapt content delivery to individual cognitive profiles.',
    category: 'built',
    tags: ['AI', 'EdTech', 'Machine Learning'],
    featured: false,
  },
  {
    id: 'tutr',
    title: 'Tutr',
    description:
      'An AI SMS agent for on-demand tutoring. Text-based intelligent tutoring system delivering personalized academic support through conversational AI.',
    category: 'built',
    tags: ['AI', 'SMS', 'NLP', 'EdTech'],
    featured: false,
  },
]

