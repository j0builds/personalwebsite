export interface Project {
  id: string
  title: string
  description: string
  category: 'research' | 'built'
  tags: string[]
  image?: string
  link?: string
  external?: boolean
  featured?: boolean
}

export interface Experience {
  id: string
  role: string
  organization: string
  period: string
  description?: string
  image?: string
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  year: number
  venue: string
  abstract: string
  tags: string[]
  featured?: boolean
  doi?: string
  link?: string
}
