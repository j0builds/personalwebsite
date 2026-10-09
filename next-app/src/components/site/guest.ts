export interface Guest {
  name: string
  company?: string
}

/** Turns a URL fragment like "sarah-jane" into "Sarah Jane"; null if nothing printable is left. */
export function cleanName(raw: string | null | undefined, max = 24): string | null {
  if (!raw) return null
  let s = raw
  try {
    s = decodeURIComponent(raw)
  } catch {}
  s = s
    .replace(/[-_+.]+/g, ' ')
    .replace(/[^\p{L}\p{M}' ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim()
  if (!s) return null
  return s
    .split(' ')
    .map((w) => (w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

/** Builds a guest from the `/hi/<name>[/<company>]` segments. */
export function guestFromSegments(segments: string[]): Guest | null {
  if (segments.length < 1 || segments.length > 2) return null
  const name = cleanName(segments[0])
  if (!name) return null
  const company = cleanName(segments[1], 32) ?? undefined
  return { name, company }
}

/** Reads a guest from `/hi/<name>[/<company>]` or `?for=<name>[&at=<company>]`. */
export function guestFrom(path: string, search: string): Guest | null {
  const m = path.match(/^\/hi\/([^/]+)(?:\/([^/]+))?\/?$/)
  if (m) return guestFromSegments(m.slice(1).filter(Boolean) as string[])
  const q = new URLSearchParams(search)
  const name = cleanName(q.get('for'))
  if (!name) return null
  return { name, company: cleanName(q.get('at'), 32) ?? undefined }
}
