'use client'

import { useEffect } from 'react'
import { SOCIAL_LINKS } from '@/lib/constants'
import { readHour, skyColors } from './Sky'
import { useVisitor } from './visitor'

function faviconFor(hour: number) {
  const { top, bottom } = skyColors(hour)
  const day = hour >= 5.75 && hour < 19.5
  // The sun rises from the horizon at dawn, peaks at noon and sets again at dusk.
  const arc = Math.sin((Math.PI * Math.min(Math.max(hour - 5.75, 0), 13.75)) / 13.75)
  const body = day
    ? `<circle cx="16" cy="${(26 - 15 * arc).toFixed(1)}" r="6" fill="#fff4cf"/>`
    : `<mask id="m"><rect width="32" height="32" fill="#fff"/><circle cx="23" cy="9" r="6" fill="#000"/></mask>` +
      `<circle cx="19" cy="12" r="7" fill="#f3f1e8" mask="url(#m)"/>` +
      `<circle cx="8" cy="8" r="1" fill="#fff"/><circle cx="11" cy="22" r=".8" fill="#fff" opacity=".7"/>`
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>` +
    `<clipPath id="c"><rect width="32" height="32" rx="8"/></clipPath></defs>` +
    `<g clip-path="url(#c)"><rect width="32" height="32" fill="url(#g)"/>${body}</g></svg>`
  )
}

let greeted = false

/** Small touches outside the page itself: a favicon that follows the sky, a tab title for when you look away, and a note in the console. */
export function SiteSignals() {
  const name = useVisitor()?.guest?.name.split(' ')[0]

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.dataset.sky = ''
    document.head.appendChild(link)
    const paint = () => {
      link.href = `data:image/svg+xml,${encodeURIComponent(faviconFor(readHour()))}`
    }
    paint()
    const id = window.setInterval(paint, 60_000)
    return () => {
      window.clearInterval(id)
      link.remove()
    }
  }, [])

  useEffect(() => {
    let kept: string | null = null
    let shown = ''
    const onVisibility = () => {
      if (document.hidden) {
        const hour = readHour()
        shown = name ? `Still here, ${name}.` : hour < 5.75 || hour >= 19.5 ? 'The stars are still out.' : 'The sky\u2019s still here.'
        kept = document.title
        document.title = shown
      } else if (kept !== null) {
        if (document.title === shown) document.title = kept
        kept = null
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      if (kept !== null && document.title === shown) document.title = kept
    }
  }, [name])

  useEffect(() => {
    if (greeted) return
    greeted = true
    console.log(
      '%cHi there. You opened the console, so you\u2019re my kind of person.',
      'font: 400 22px/1.4 "Instrument Serif", Georgia, serif; color: #6a7ca4',
    )
    console.log(
      '%cThe sky behind this page is your local time. The favicon follows it too.\n' +
        'Sending this to someone? /hi/their-name makes the page theirs.\n' +
        'Nothing here is tracked. Say hello: ' +
        SOCIAL_LINKS.email,
      'font: 12px/1.7 ui-monospace, Menlo, monospace; color: #8a94a6',
    )
  }, [])

  return null
}
