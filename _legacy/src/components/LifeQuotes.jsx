import React, { useMemo } from 'react'
import { lifeQuotes } from '../data/homeData'

// Life quotes component (shown after bubbles disappear)
export default function LifeQuotes() {
  const memoizedLifeQuotes = useMemo(() => 
    lifeQuotes.map((quote, index) => (
      <p key={index} className="life-quote" style={{ animationDelay: `${index * 0.2}s` }}>
        {quote}
      </p>
    )), [])

  return (
    <div className="life-quotes-container">
      {/* Title section at top */}
      <div className="quotes-title-section">
        <h1 className="quotes-title">hey i'm Joseph Ayinde</h1>
        <p className="quotes-subtitle">aka j0</p>
        <p className="quotes-description">and i am a polymath (builder, thinker, dreamer)</p>
        <p className="quotes-location">from greensboro north carolina</p>
        <p className="quotes-citizenship">i am a dual citizen of both the united states and nigeria</p>
      </div>
      
      {/* Quotes at bottom */}
      <div className="life-quotes-content">
        {memoizedLifeQuotes}
      </div>
    </div>
  )
}
