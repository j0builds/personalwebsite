import { Hero } from '@/components/home/Hero'
import { AuroraBackground } from '@/components/home/AuroraBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AuroraBackground />
      <Hero />
    </div>
  )
}
