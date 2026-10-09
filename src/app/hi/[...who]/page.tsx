import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WindowHome } from '@/components/home/WindowHome'
import { guestFromSegments } from '@/components/site/guest'

type Props = { params: Promise<{ who: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guest = guestFromSegments((await params).who)
  if (!guest) return {}
  const title = `For ${guest.name}`
  const description = `${guest.name}, Joseph Ayinde left a window open for you. Take a minute.`
  const q = new URLSearchParams({ name: guest.name, ...(guest.company ? { at: guest.company } : {}) })
  const image = { url: `/og?${q}`, width: 1200, height: 630, alt: `A window left open, for ${guest.name}` }
  return {
    title,
    description,
    robots: { index: false },
    openGraph: { title: `${title} | Joseph Ayinde`, description, images: [image] },
    twitter: { card: 'summary_large_image', title: `${title} | Joseph Ayinde`, description, images: [image] },
  }
}

export default async function HiPage({ params }: Props) {
  if (!guestFromSegments((await params).who)) notFound()
  return <WindowHome />
}
