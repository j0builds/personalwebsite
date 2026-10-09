'use client'

import { SOCIALS } from './links'
import { LocalTime } from './Sky'

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1240px] px-6 pb-10 sm:px-10">
      <div className="flex flex-col gap-3 border-t border-current/15 pt-6 text-[13px] sm:flex-row sm:items-baseline sm:justify-between">
        <p className="opacity-60">
          <LocalTime suffix="where you are. Thanks for taking your time." />
        </p>
        <p className="flex gap-5">
          {SOCIALS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="opacity-60 transition-opacity duration-300 hover:opacity-100"
            >
              {s.label}
            </a>
          ))}
        </p>
      </div>
    </footer>
  )
}
