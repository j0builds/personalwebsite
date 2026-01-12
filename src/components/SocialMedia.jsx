import React from 'react'
import './SocialMedia.css'

function SocialMedia() {
  return (
    <div className="social-media-container">
      <a 
        href="https://www.instagram.com/joseph.ayinde/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-bubble instagram-bubble"
        aria-label="Instagram"
      >
        <span className="social-icon">📸</span>
      </a>
      <a 
        href="https://www.linkedin.com/in/josephayinde/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-bubble linkedin-bubble"
        aria-label="LinkedIn"
      >
        <span className="social-icon">💼</span>
      </a>
    </div>
  )
}

export default SocialMedia
