import type { Project, Experience, Publication } from './types'

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

export const experiences: Experience[] = [
  {
    id: 'willow',
    role: 'Growth',
    organization: 'Willow',
    period: 'Jan 2026 – Present',
  },
  {
    id: 'chatbase',
    role: 'Content Engineer',
    organization: 'Chatbase',
    period: '2025 – Present',
    description:
      'Content engineering for AI-powered chatbot platform.',
  },
  {
    id: 'cognition',
    role: 'CEO & Co-Founder',
    organization: 'Cognition (formerly HEALLY)',
    period: 'Nov 2022 – Aug 2025',
    description:
      'Built the Cognitive OS for Learning. Prototyped non-invasive EEG-AI BCI. $150K+ raised. Partners: Google DeepMind, NVIDIA, CMU LearnLab, CARTA.',
    image: '/assets/images/cognition.jpg',
  },
  {
    id: 'cmu',
    role: 'Computational Models of Learning Scholar',
    organization: 'Carnegie Mellon University LearnLab',
    period: 'May – Sept 2025',
    description:
      '#1 learning science lab in the world. 7-month institutional partnership. Prototyped AI hardware and software on the KLI framework.',
    image: '/assets/images/cmu.jpg',
  },
  {
    id: 'openai',
    role: 'Member of Technical Staff',
    organization: 'OpenAI',
    period: 'Jan – May 2024',
    description:
      'Biology expert for next-generation LLMs. Fine-tuned models for scientific reasoning and data interpretation.',
    image: '/assets/images/open-ai.jpg',
  },
  {
    id: 'scale-ai',
    role: 'AI Specialist',
    organization: 'Scale AI',
    period: '2024',
    description:
      'Prompt engineering and feedback loop refinement for AI algorithms in biological contexts.',
  },
  {
    id: 'pfennig-lab',
    role: 'Independent Project Leader & Lab Assistant',
    organization: 'Pfennig Lab, UNC',
    period: 'Nov 2023 – May 2024',
    description:
      '$500K NSF research project. Sanger sequencing, NGS, gel electrophoresis, DNA analysis.',
  },
  {
    id: 'neurosurgery',
    role: 'Research Project Leader & Intern',
    organization: 'Computational Neurosurgery Lab, Macquarie University Hospital',
    period: 'Jun – Aug 2023',
    description:
      "World's first undergraduate intern in the world's first Computational Neurosurgery lab. 80+ operations shadowed.",
  },
  {
    id: 'residency',
    role: 'Delta Finalist',
    organization: "The Residency (Sam Altman's Accelerator)",
    period: '2025',
    description: '20 of 1,500 companies selected worldwide.',
  },
  {
    id: 'launch',
    role: 'Summer Venture Fellow',
    organization: 'LAUNCH Chapel Hill Accelerator',
    period: 'May – Aug 2024',
    description:
      '1 of 10 ventures across North Carolina. Mentored by Harvard Business School faculty.',
  },
  {
    id: 'lingoace',
    role: 'Mathematics Tutor',
    organization: 'LingoAce',
    period: '2022 – 2023',
    description:
      'Selected to tutor STEM subjects. Specialized in general chemistry and calculus for K-12 students.',
  },
  {
    id: 'unc',
    role: 'B.S. Biology, Neuroscience, Chemistry (Honors)',
    organization: 'UNC Chapel Hill',
    period: '2021 – 2025',
    description: "Chancellor's Science Scholar, 1 of 25 selected worldwide. Honors Carolina.",
  },
]
