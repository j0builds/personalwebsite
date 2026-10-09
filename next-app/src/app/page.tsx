import { Instrument_Serif } from 'next/font/google'
import { WindowHome } from '@/components/home/WindowHome'

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument',
  display: 'swap',
})

export default function Home() {
  return (
    <div className={instrument.variable}>
      <WindowHome />
    </div>
  )
}
