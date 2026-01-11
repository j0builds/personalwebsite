import React, { useMemo } from 'react'
import { essayContent } from '../data/homeData'
import ContactForm from './ContactForm'

// Document/essay view component
export default function DocumentView({ 
  exploreClicked, 
  formData, 
  formStatus, 
  onExploreClick, 
  onFormChange, 
  onFormSubmit 
}) {
  const memoizedEssayContent = useMemo(() => 
    essayContent.map((line, index) => {
      if (line.includes('LinkedIn')) {
        return (
          <p key={index}>
            <a href="https://www.linkedin.com/in/joseph-ayinde" target="_blank" rel="noopener noreferrer" className="page-link">{line}</a>
          </p>
        )
      }
      if (line.includes('@') && line.includes('.com')) {
        return (
          <p key={index}>
            <a href={`mailto:${line}`} className="page-link">{line}</a>
          </p>
        )
      }
      if (line && line === line.toUpperCase() && line.length > 3 && !line.startsWith('•')) {
        return <h3 key={index} className="essay-heading">{line}</h3>
      }
      return <p key={index}>{line}</p>
    }), [])

  return (
    <div className="document-container">
      <div className="essay-container">
        <div className="essay-content">
          <div className="essay-text">
            {memoizedEssayContent}
            
            <div className="connect-section">
              {!exploreClicked ? (
                <button className="explore-button" onClick={onExploreClick}>explore more</button>
              ) : (
                <ContactForm
                  formData={formData}
                  formStatus={formStatus}
                  exploreClicked={exploreClicked}
                  onFormChange={onFormChange}
                  onFormSubmit={onFormSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
