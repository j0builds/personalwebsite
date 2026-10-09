import type { Metadata } from 'next'
import { ConceptSwitcher } from '@/components/concepts/ConceptSwitcher'
import { conceptFontVars } from './fonts'
import './concepts.css'

export const metadata: Metadata = {
  title: 'Concepts',
  robots: { index: false, follow: false },
}

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={conceptFontVars}>
      {children}
      <ConceptSwitcher />
    </div>
  )
}
