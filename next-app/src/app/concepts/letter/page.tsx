import type { Metadata } from 'next'
import { Letter } from '@/components/concepts/Letter'

export const metadata: Metadata = { title: 'Letter' }

export default function Page() {
  return <Letter />
}
