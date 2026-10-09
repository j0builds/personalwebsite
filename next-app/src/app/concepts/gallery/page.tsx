import type { Metadata } from 'next'
import { Gallery } from '@/components/concepts/Gallery'

export const metadata: Metadata = { title: 'Gallery' }

export default function Page() {
  return <Gallery />
}
