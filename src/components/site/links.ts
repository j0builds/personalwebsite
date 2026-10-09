import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'

export const LINKS = {
  work: { label: 'Work', href: '/projects' },
  about: { label: 'About', href: '/about' },
  lab: { label: 'Lam Lab', href: SITE_CONFIG.companyUrl },
  email: { label: 'Email', href: `mailto:${SOCIAL_LINKS.email}` },
  github: { label: 'GitHub', href: SOCIAL_LINKS.github },
  linkedin: { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
  instagram: { label: 'Instagram', href: SOCIAL_LINKS.instagram },
} as const

export const SOCIALS = [LINKS.github, LINKS.linkedin, LINKS.instagram] as const
