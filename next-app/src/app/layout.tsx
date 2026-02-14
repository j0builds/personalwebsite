import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { ComfortTint } from '@/components/shared/ComfortTint'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    default: 'Joseph Ayinde | Builder, Researcher, Dreamer',
    template: '%s | Joseph Ayinde',
  },
  description:
    'Polymath builder at the intersection of neuroscience, AI, and human experience. Ex-OpenAI MTS, CMU Scholar, CEO of Cognition.',
  openGraph: {
    title: 'Joseph Ayinde (j0)',
    description: 'Polymath builder. Ex-OpenAI. Neuroscience x AI.',
    url: 'https://josephayinde.com',
    siteName: 'Joseph Ayinde',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joseph Ayinde (j0)',
    description: 'Polymath builder. Ex-OpenAI. Neuroscience x AI.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="bg-[#fafafa] text-neutral-900 font-sans antialiased">
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
