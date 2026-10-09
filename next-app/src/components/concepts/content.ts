import { SOCIAL_LINKS } from '@/lib/constants'

export const PERSON = {
  name: 'Joseph Ayinde',
  first: 'Joseph',
  alias: 'j0',
  email: SOCIAL_LINKS.email,
  home: 'Greensboro, North Carolina',
} as const

export const LINKS = {
  work: { label: 'Work', href: '/projects' },
  about: { label: 'About', href: '/about' },
  email: { label: 'Email', href: `mailto:${SOCIAL_LINKS.email}` },
  github: { label: 'GitHub', href: SOCIAL_LINKS.github },
  linkedin: { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
  instagram: { label: 'Instagram', href: SOCIAL_LINKS.instagram },
} as const

export const SOCIALS = [LINKS.github, LINKS.linkedin, LINKS.instagram] as const

export const CONCEPTS = [
  {
    slug: 'letter',
    name: 'Letter',
    line: 'A note on warm paper. You read it, like mail.',
    swatch: ['#f6f1e7', '#2a2620', '#b0613f'],
  },
  {
    slug: 'window',
    name: 'Window',
    line: 'The sky follows your local time. One minute to breathe.',
    swatch: ['#dfe7ef', '#2d3a4a', '#e9b98f'],
  },
  {
    slug: 'pitch',
    name: 'Pitch',
    line: 'The stadium after everyone’s gone home.',
    swatch: ['#0f2a1e', '#e9efe6', '#c9f24a'],
  },
  {
    slug: 'gallery',
    name: 'Gallery',
    line: 'One photograph, one wall label, a lot of space.',
    swatch: ['#f1efea', '#1b1b1a', '#8a8378'],
  },
  {
    slug: 'water',
    name: 'Still water',
    line: 'A dark pond that answers your cursor, slowly.',
    swatch: ['#0b1d27', '#d9e6ea', '#5f8f9c'],
  },
] as const

export type ConceptSlug = (typeof CONCEPTS)[number]['slug']
