import type { Metadata } from 'next'
import { Water } from '@/components/concepts/Water'

export const metadata: Metadata = { title: 'Still water' }

export default function Page() {
  return <Water />
}
