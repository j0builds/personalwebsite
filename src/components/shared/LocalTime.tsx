'use client'

import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Los_Angeles',
  timeZoneName: 'short',
})

export function LocalTime({ className = '' }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setNow(formatter.format(new Date()))
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className={className} suppressHydrationWarning>
      {now ?? '—'}
    </span>
  )
}
