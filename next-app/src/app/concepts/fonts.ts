import {
  Barlow_Condensed,
  Fraunces,
  Instrument_Serif,
  Mrs_Saint_Delafield,
  Newsreader,
} from 'next/font/google'

export const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const signature = Mrs_Saint_Delafield({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-signature',
  display: 'swap',
})

export const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

export const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const conceptFontVars = [
  newsreader.variable,
  signature.variable,
  instrument.variable,
  barlow.variable,
  fraunces.variable,
].join(' ')
