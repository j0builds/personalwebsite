'use client'

import { useSyncExternalStore } from 'react'
import { GATE_OPEN_EVENT } from './constants'

const subscribe = (onChange: () => void) => {
  window.addEventListener(GATE_OPEN_EVENT, onChange)
  return () => window.removeEventListener(GATE_OPEN_EVENT, onChange)
}
const getSnapshot = () => document.documentElement.getAttribute('data-gate') === 'open'
const getServerSnapshot = () => false

/** False while the penalty gate still covers the page; flips to true the moment it opens. */
export function useGateOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
