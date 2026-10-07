export interface Project {
  id: string
  title: string
  description: string
  category: 'research' | 'built'
  tags: string[]
  meta?: string
  image?: string
  link?: string
  external?: boolean
  featured?: boolean
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

export interface Chapter {
  id: string
  age: string
  title: string
  body: string
}
