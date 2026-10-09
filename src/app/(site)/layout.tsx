import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Sky } from '@/components/site/Sky'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Sky variant="reading">
      <SiteHeader />
      <main className="mx-auto max-w-[1240px] px-6 pb-28 pt-[clamp(56px,11vh,120px)] sm:px-10">{children}</main>
      <SiteFooter />
    </Sky>
  )
}
