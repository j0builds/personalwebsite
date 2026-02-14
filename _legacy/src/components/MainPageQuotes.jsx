import React, { useMemo } from 'react'
import { lifeQuotes } from '../data/homeData'

// Main page quotes component (shown with bubbles)
export default function MainPageQuotes() {
  const memoizedMainQuotes = useMemo(() => 
    lifeQuotes.map((quote, index) => (
      <p key={index} className="main-quote" style={{ animationDelay: `${index * 0.3}s` }}>
        {quote}
      </p>
    )), [])

  return (
    <div className="main-page-quotes">
      {memoizedMainQuotes}
    </div>
  )
}
