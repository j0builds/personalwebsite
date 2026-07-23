import type { Metadata } from 'next'
import { Newsreader, Space_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { ComfortTint } from '@/components/shared/ComfortTint'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-sans-body',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Joseph Ayinde | Co-Founder & CEO, The Learning and Memory Lab',
    template: '%s | Joseph Ayinde',
  },
  description:
    'Co-founder & CEO of The Learning and Memory Lab. Building a world where humans and machines can learn together. Polymath. Tar Heel. SF Bay Area.',
  openGraph: {
    title: 'Joseph Ayinde (j0)',
    description:
      'Co-founder & CEO @ The Learning and Memory Lab. Humans + machines learning together.',
    url: 'https://josephayinde.com',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${spaceMono.variable}`}>
      <body className="bg-[#f7f6f4] text-neutral-900 font-sans antialiased">
        <SmoothScroll />
        <CustomCursor />
        <ComfortTint />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
