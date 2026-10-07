import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { CommandMenu } from '@/components/shared/CommandMenu'
import { SITE_CONFIG } from '@/lib/constants'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const description =
  'Co-founder & CEO of The Learning and Memory Lab. Building a world where humans and machines can learn together. Polymath. Tar Heel. SF Bay Area.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'Joseph Ayinde | Co-Founder & CEO, The Learning and Memory Lab',
    template: '%s | Joseph Ayinde',
  },
  description,
  openGraph: {
    title: 'Joseph Ayinde (j0)',
    description:
      'Co-founder & CEO @ The Learning and Memory Lab. Humans + machines learning together.',
    url: SITE_CONFIG.url,
    siteName: 'Joseph Ayinde',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joseph Ayinde (j0)',
    description:
      'Co-founder & CEO @ The Learning and Memory Lab. Humans + machines learning together.',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="bg-ink font-sans text-paper antialiased">
        <SmoothScroll />
        <CustomCursor />
        <CommandMenu />
        <div className="grain" aria-hidden />
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
