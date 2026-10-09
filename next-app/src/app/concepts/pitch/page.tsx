import type { Metadata } from 'next'
import { Pitch } from '@/components/concepts/Pitch'

export const metadata: Metadata = { title: 'Pitch' }

export default function Page() {
  return <Pitch />
}
