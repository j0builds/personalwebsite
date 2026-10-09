import type { Metadata } from 'next'
import { WindowConcept } from '@/components/concepts/Window'

export const metadata: Metadata = { title: 'Window' }

export default function Page() {
  return <WindowConcept />
}
