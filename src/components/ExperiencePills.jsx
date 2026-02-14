import React, { useMemo } from 'react'
import { hiddenSecrets } from '../data/homeData'

// Experience pills component (bubbles with spring physics)
export default function ExperiencePills({ 
  showBubbles, 
  isMobile, 
  bubbleElementsRef, 
  onSecretClick 
}) {
  const memoizedSecrets = useMemo(() => hiddenSecrets, [])

  if (!showBubbles) return null

  return (
    <div 
      className={`secrets-layer permanent-secrets experience-layer ${!showBubbles ? 'fade-out' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        overflow: 'visible'
      }}
    >
      {memoizedSecrets.map(secret => (
        <div
          key={`secret-${secret.id}`}
          ref={el => bubbleElementsRef.current[secret.id] = el}
          className="secret-item revealed permanent clickable experience-pill"
          style={{ 
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'translate3d(0, 0, 0)',
            zIndex: 10010,
            opacity: showBubbles ? 1 : 0,
            visibility: showBubbles ? 'visible' : 'hidden',
            display: showBubbles ? 'block' : 'none',
            pointerEvents: 'auto',
            minWidth: '90px',
            minHeight: '25px',
            willChange: 'transform',
            transformOrigin: 'center center',
            backfaceVisibility: 'hidden',
            perspective: 1000
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onSecretClick(secret)
          }}
          onTouchEnd={isMobile ? (e) => {
            e.preventDefault()
            e.stopPropagation()
            onSecretClick(secret)
          } : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSecretClick(secret)
            }
          }}
        >
          <div 
            className="secret-text" 
            style={{ 
              opacity: showBubbles ? 1 : 0, 
              visibility: showBubbles ? 'visible' : 'hidden', 
              display: showBubbles ? 'inline-block' : 'none',
              pointerEvents: 'none',
              borderRadius: secret.id % 3 === 0 
                ? '60% 40% 30% 70% / 60% 30% 70% 40%'
                : secret.id % 3 === 1
                ? '30% 60% 70% 40% / 50% 60% 30% 60%'
                : '50% 50% 50% 50% / 50% 50% 50% 50%',
              animationDelay: `${secret.id * 0.5}s`
            }}
          >
            {secret.text}
          </div>
        </div>
      ))}
    </div>
  )
}
