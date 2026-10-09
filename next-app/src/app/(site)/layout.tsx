import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { ComfortTint } from '@/components/shared/ComfortTint'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <ComfortTint />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
