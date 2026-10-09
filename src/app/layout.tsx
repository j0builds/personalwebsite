import type { Metadata } from 'next'
import { Inter, Instrument_Serif, Space_Mono } from 'next/font/google'
import { PenaltyGate } from '@/components/gate/PenaltyGate'
import { GATE_STORAGE_KEY } from '@/components/gate/constants'
import { SiteSignals } from '@/components/site/SiteSignals'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://josephayinde.com'),
  title: {
    default: 'Joseph Ayinde | Co-Founder & CEO, The Learning and Memory Lab',
    template: '%s | Joseph Ayinde',
  },
  description:
    'Co-founder & CEO of The Learning and Memory Lab. Building a world where humans and machines can learn together. Polymath. Tar Heel. SF Bay Area.',
  openGraph: {
    title: 'Joseph Ayinde (j0)',
    description: 'Co-founder & CEO @ The Learning and Memory Lab. Humans + machines learning together.',
    url: 'https://josephayinde.com',
    siteName: 'Joseph Ayinde',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joseph Ayinde (j0)',
    description: 'Co-founder & CEO @ The Learning and Memory Lab. Humans + machines learning together.',
  },
}

// Runs before first paint so a visitor who already made the save never sees the gate flash.
const gateScript = `try{var s=sessionStorage.getItem('${GATE_STORAGE_KEY}');if(s==='open'||/[?&]gate=open(&|$)/.test(location.search)){document.documentElement.setAttribute('data-gate','open')}}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: gateScript }} />
      </head>
      <body className="bg-[#fafafa] text-neutral-900 font-sans antialiased">
        <PenaltyGate />
        <SiteSignals />
        {children}
      </body>
    </html>
  )
}
